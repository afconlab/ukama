/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present, Ukama Inc.
 */

package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/num30/config"
	uuid "github.com/satori/go.uuid"
	"github.com/ukama/ukama/systems/common/metrics"
	"github.com/ukama/ukama/systems/common/msgbus"
	"github.com/ukama/ukama/systems/services/eventGenerator/cmd/version"
	"github.com/ukama/ukama/systems/services/eventGenerator/pkg"
	"github.com/ukama/ukama/systems/services/eventGenerator/pkg/server"
	"google.golang.org/grpc"
	"gopkg.in/yaml.v3"

	log "github.com/sirupsen/logrus"
	ccmd "github.com/ukama/ukama/systems/common/cmd"
	ugrpc "github.com/ukama/ukama/systems/common/grpc"
	mb "github.com/ukama/ukama/systems/common/msgBusServiceClient"
	egenerated "github.com/ukama/ukama/systems/common/pb/gen/events"
)

const (
	MESH_IP_UPDATE            = "event.cloud.global.{{ .Org}}.messaging.mesh.ip.update"
	EVTGEN_NODEFEEDER_PUBLISH = "request.cloud.local.{{ .Org}}.messaging.eventgenerator.nodefeeder.publish"
	MESH_NODE_ONLINE          = "event.cloud.local.{{ .Org}}.messaging.mesh.node.online"
	REGISTRY_NODE_CREATE      = "event.cloud.local.{{ .Org}}.registry.node.node.create"
)

var serviceConfig = pkg.NewConfig(pkg.ServiceName)

func main() {
	ccmd.ProcessVersionArgument("eventGenerator", os.Args, version.Version)

	/* Log level */
	log.SetLevel(log.TraceLevel)
	log.Infof("Starting the eventGenerator service")

	handleSigterm(func() {
		log.Debugf("ExitingMocking a service..!!")
	})

	initConfig()

	metrics.StartMetricsServer(serviceConfig.Metrics)

	start_service()

	log.Infof("Exiting service %s", pkg.ServiceName)

}

func initConfig() {
	log.Infof("Initializing config")

	err := config.NewConfReader(pkg.ServiceName).Read(serviceConfig)
	if err != nil {
		log.Fatal("Error reading config ", err)
	} else if serviceConfig.DebugMode {
		b, err := yaml.Marshal(serviceConfig)
		if err != nil {
			log.Infof("Config:\n%s", string(b))
		}
	}

	log.Debugf("\nService: %s DB Config: %+v Service: %+v MsgClient Config %+v", pkg.ServiceName, serviceConfig.DB, serviceConfig.Service, serviceConfig.MsgClient)
	pkg.IsDebugMode = serviceConfig.DebugMode
}

func start_service() {

	instanceId := os.Getenv("POD_NAME")
	if instanceId == "" {
		/* used on local machines */
		inst := uuid.NewV4()
		instanceId = inst.String()
	}

	mbClient := mb.NewMsgBusClient(serviceConfig.MsgClient.Timeout, serviceConfig.OrgName, pkg.SystemName,
		pkg.ServiceName, instanceId, serviceConfig.Queue.Uri,
		serviceConfig.Service.Uri, serviceConfig.MsgClient.Host, serviceConfig.MsgClient.Exchange,
		serviceConfig.MsgClient.ListenQueue, serviceConfig.MsgClient.PublishQueue,
		serviceConfig.MsgClient.RetryCount,
		serviceConfig.MsgClient.ListenerRoutes)

	log.Debugf("MessageBus Client is %+v", mbClient)

	grpcServer := ugrpc.NewGrpcServer(*serviceConfig.Grpc, func(s *grpc.Server) {
		nSrv := server.NewEventServer()
		egenerated.RegisterEventNotificationServiceServer(s, nSrv)
	})

	go msgBusListener(mbClient)

	go grpcServer.StartServer()

	start(mbClient)

}

func msgBusListener(m mb.MsgBusServiceClient) {

	if err := m.Register(); err != nil {
		log.Fatalf("Failed to register to Message Client Service. Error %s", err.Error())
	}

	if err := m.Start(); err != nil {
		log.Fatalf("Failed to start to Message Client Service routine for service %s. Error %s", pkg.ServiceName, err.Error())
	}
}

func usageError() {
	log.Println("Enter event key when prompted.")
	log.Printf("Possible Keys:")
	log.Printf(MESH_IP_UPDATE)
	log.Printf(EVTGEN_NODEFEEDER_PUBLISH)
	log.Printf(MESH_NODE_ONLINE)
	log.Printf(REGISTRY_NODE_CREATE)
	log.Printf("Example: For Route: event.cloud.global.{{ .Org}}.messaging.mesh.ip.update of Org ukama-org  Key is event.cloud.global.ukamaorg.messaging.mesh.ip.update ")

}

func start(m mb.MsgBusServiceClient) {

	time.Sleep(2 * time.Second)

	for {
		var route string

		log.Println("Enter the routing key:")
		fmt.Scanln(&route)
		_, err := msgbus.Parse(route)
		if err != nil {
			usageError()
			continue
		}

		// Makes sure connection is closed when service exits.
		switch route {
		case msgbus.PrepareRoute(serviceConfig.OrgName, MESH_IP_UPDATE):
			//event.cloud.global.ukamaorg.messaging.mesh.ip.update
			log.Infof("Found messages for event %s", route)
			k := msgbus.PrepareRoute(serviceConfig.OrgName, MESH_IP_UPDATE)
			err := pkg.MeshIPUpdateEvent(serviceConfig, k, m)
			if err != nil {
				log.Errorf("Failed to publish message for key: %s. Error: %s", k, err.Error())
			}

		case msgbus.PrepareRoute(serviceConfig.OrgName, EVTGEN_NODEFEEDER_PUBLISH):
			//request.cloud.local.ukamaorg.messaging.eventgenerator.nodefeeder.publish
			k := msgbus.PrepareRoute(serviceConfig.OrgName, EVTGEN_NODEFEEDER_PUBLISH)
			err := pkg.NodeFeederPublishMessage(serviceConfig, k, m)
			if err != nil {
				log.Errorf("Failed to publish message for key: %s. Error: %s", k, err.Error())
			}

		case msgbus.PrepareRoute(serviceConfig.OrgName, MESH_NODE_ONLINE):
			//event.cloud.local.ukamaorg.messaging.mesh.node.online
			k := msgbus.PrepareRoute(serviceConfig.OrgName, MESH_NODE_ONLINE)
			err := pkg.MeshNodeOnlineEvent(serviceConfig, k, m)
			if err != nil {
				log.Errorf("Failed to publish message for key: %s. Error: %s", k, err.Error())
			}

		case msgbus.PrepareRoute(serviceConfig.OrgName, REGISTRY_NODE_CREATE):
			//event.cloud.local.ukamaorg.messaging.mesh.node.online
			k := msgbus.PrepareRoute(serviceConfig.OrgName, REGISTRY_NODE_CREATE)
			err := pkg.RegistryNodeCreateEvent(serviceConfig, k, m)
			if err != nil {
				log.Errorf("Failed to publish message for key: %s. Error: %s", k, err.Error())
			}

		default:
			log.Infof("No message for route %s implemented", route)
		}
	}
}

// Handles Ctrl+C or most other means of "controlled" shutdown gracefully. Invokes the supplied func before exiting.
func handleSigterm(handleExit func()) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, syscall.SIGTERM)

	go func() {
		<-c
		handleExit()
		os.Exit(1)
	}()

}
