/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present, Ukama Inc.
 */

package pkg

import (
	"time"

	uconf "github.com/ukama/ukama/systems/common/config"
)

type Config struct {
	uconf.BaseConfig `mapstructure:",squash"`
	DB               *uconf.Database  `default:"{}"`
	Grpc             *uconf.Grpc      `default:"{}"`
	Queue            *uconf.Queue     `default:"{}"`
	Metrics          *uconf.Metrics   `default:"{}"`
	Timeout          time.Duration    `default:"3s"`
	MsgClient        *uconf.MsgClient `default:"{}"`
	Service          *uconf.Service
	OrgName          string `default:"ukama-org"`
	OrgId            string `default:"abdc6715-1a87-46cf-9112-cfb3ea2adbec"`
}

func NewConfig(name string) *Config {
	return &Config{
		DB: &uconf.Database{
			DbName: name,
		},
		Queue: &uconf.Queue{
			Uri: "amqp://guest:guest@192.168.0.14:5672",
		},
		Service: uconf.LoadServiceHostConfig(name),
		MsgClient: &uconf.MsgClient{
			Host:    "localhost:9000",
			Timeout: 5 * time.Second,
			ListenerRoutes: []string{
				"*.*.*.*.*.*.*.*",
			},
		},
	}
}
