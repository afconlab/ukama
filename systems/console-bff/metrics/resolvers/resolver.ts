/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present, Ukama Inc.
 */

import {
  Arg,
  Args,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Worker } from "worker_threads";

import { METRIC_API_GW_SOCKET, STORAGE_KEY } from "../../common/configs";
import { logger } from "../../common/logger";
import { removeKeyFromStorage, storeInStorage } from "../../common/storage";
import { getGraphsKeyByType, getTimestampCount } from "../../common/utils";
import {
  getLatestMetric,
  getMetricRange,
  getNodeRangeMetric,
} from "../datasource/metrics-api";
import {
  GetLatestMetricInput,
  GetMetricByTabInput,
  GetMetricRangeInput,
  LatestMetricRes,
  MetricRes,
  MetricsRes,
  SubMetricByTabInput,
  SubMetricRangeInput,
} from "./types";

const WS_THREAD = "./threads/MetricsWSThread.js";

const getErrorRes = (msg: string) =>
  ({
    orgId: "",
    msg: msg,
    type: "",
    nodeId: "",
    values: [],
    success: false,
  } as MetricRes);

@Resolver(MetricRes)
class MetricResolvers {
  @Query(() => LatestMetricRes)
  async getLatestMetric(@Arg("data") data: GetLatestMetricInput) {
    return await getLatestMetric(data);
  }

  @Query(() => MetricsRes)
  async getMetricByTab(
    @Arg("data") data: GetMetricByTabInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const { type, orgId, userId, nodeId, withSubscription, from } = data;
    if (from === 0) throw new Error("Argument 'from' can't be zero.");
    const metricsKey: string[] = getGraphsKeyByType(type, nodeId);
    const metrics: MetricsRes = { metrics: [] };
    if (metricsKey.length > 0) {
      for (let i = 0; i < metricsKey.length; i++) {
        const res = await getNodeRangeMetric({ ...data, type: metricsKey[i] });
        metrics.metrics.push(res);
      }
    }
    if (withSubscription && metrics.metrics.length > 0) {
      let subKey = "";
      metrics.metrics.map((metric: MetricRes) => {
        if (metric.values.length > 2) subKey = subKey + metric.type + ",";
      });
      subKey = subKey.slice(0, -1);
      subKey.split(",").map((key: string) => {
        const workerData = {
          type: key,
          orgId,
          userId,
          url: `${METRIC_API_GW_SOCKET}/v1/live/metrics?interval=1&metric=${key}&node=${nodeId}`,
          key: STORAGE_KEY,
          timestamp: from,
        };
        const worker = new Worker(WS_THREAD, {
          workerData,
        });
        worker.on("message", (_data: any) => {
          if (!_data.isError) {
            const res = JSON.parse(_data.data);
            const result = res.data.result[0];
            if (result && result.metric && result.value.length > 0) {
              pubSub.publish(key, {
                success: true,
                msg: "success",
                orgId: result.metric.org,
                nodeId: nodeId,
                type: key,
                userId: userId,
                value: result.value,
              } as LatestMetricRes);
            } else {
              return getErrorRes("No metric data found");
            }
          }
        });
        worker.on("exit", (code: any) => {
          removeKeyFromStorage(`${orgId}/${userId}/${type}/${from}`);
          logger.info(
            `WS_THREAD exited with code [${code}] for ${orgId}/${userId}/${type}`
          );
        });
      });
    }

    return metrics;
  }

  @Query(() => MetricRes)
  async getMetricRange(
    @Arg("data") data: GetMetricRangeInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const { type, orgId, userId, nodeId, withSubscription, from } = data;
    if (from === 0) throw new Error("Argument 'from' can't be zero.");
    const res = await getMetricRange(data);
    if (withSubscription && res.orgId && res.nodeId) {
      const workerData: any = {
        type,
        orgId,
        userId,
        url: `${METRIC_API_GW_SOCKET}/v1/live/metric?interval=1&metric=${type}`,
        key: STORAGE_KEY,
        timestamp: from,
      };
      const worker = new Worker(WS_THREAD, {
        workerData,
      });
      worker.on("message", (_data: any) => {
        if (!_data.isError) {
          const res = JSON.parse(_data.data);
          const result = res.data.result[0];
          if (result && result.metric && result.value.length > 0) {
            pubSub.publish(`metric-${type}`, {
              success: true,
              msg: "success",
              orgId: result.metric.org,
              nodeId: nodeId,
              type: type,
              value: result.value,
            } as LatestMetricRes);
          } else {
            return getErrorRes("No metric data found");
          }
        }
      });
      worker.on("exit", (code: any) => {
        removeKeyFromStorage(`${orgId}/${userId}/${type}/${from}`);
        logger.info(
          `WS_THREAD exited with code [${code}] for ${orgId}/${userId}/${type}`
        );
      });
    }

    return res;
  }

  @Query(() => MetricRes)
  async getNodeRangeMetric(
    @Arg("data") data: GetMetricRangeInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const { type, orgId, userId, nodeId, withSubscription, from } = data;
    if (from === 0) throw new Error("Argument 'from' can't be zero.");
    const res = await getNodeRangeMetric(data);
    if (withSubscription && res.orgId && res.nodeId) {
      const workerData: any = {
        type,
        orgId,
        userId,
        timestamp: from,
        key: STORAGE_KEY,
        url: `${METRIC_API_GW_SOCKET}/v1/live/metrics?interval=1&metric=${type}`,
      };
      const worker = new Worker(WS_THREAD, {
        workerData,
      });
      worker.on("message", (_data: any) => {
        if (!_data.isError) {
          const res = JSON.parse(_data.data);
          const result = res.data.result[0];
          if (result && result.metric && result.value.length > 0) {
            pubSub.publish(`metric-${type}`, {
              orgId: result.metric.org,
              nodeId: nodeId,
              type: type,
              value:
                result.value.length > 0
                  ? [Math.floor(result.value[0]) * 1000, result.value[1]]
                  : [],
            } as LatestMetricRes);
          } else {
            return getErrorRes("No metric data found");
          }
        }
      });
      worker.on("exit", (code: any) => {
        const keys = getGraphsKeyByType(type, nodeId);
        keys.map(async (key: string) => {
          await removeKeyFromStorage(`${orgId}/${userId}/${key}/${from}`);
        });
        logger.info(
          `WS_THREAD exited with code [${code}] for ${orgId}/${userId}/${type}`
        );
      });
    }

    return res;
  }

  @Subscription(() => LatestMetricRes, {
    topics: ({ args }) => `metric-${args.type}`,
    filter: ({ payload, args }) => {
      return args.nodeId === payload.nodeId;
    },
  })
  async getMetricRangeSub(
    @Root() payload: LatestMetricRes,
    @Args() args: SubMetricRangeInput
  ): Promise<LatestMetricRes> {
    await storeInStorage(
      `${args.orgId}/${args.userId}/${args.type}/${args.from}`,
      getTimestampCount("0")
    );
    return payload;
  }

  @Subscription(() => LatestMetricRes, {
    topics: ({ args }) => {
      return getGraphsKeyByType(args.type, args.nodeId);
    },
    filter: ({ payload, args }) => {
      return args.nodeId === payload.nodeId && args.userId === payload.userId;
    },
  })
  async getMetricByTabSub(
    @Root() payload: LatestMetricRes,
    @Args() args: SubMetricByTabInput
  ): Promise<LatestMetricRes> {
    await storeInStorage(
      `${args.orgId}/${args.userId}/${payload.type}/${args.from}`,
      getTimestampCount("0")
    );
    return payload;
  }
}

export default MetricResolvers;
