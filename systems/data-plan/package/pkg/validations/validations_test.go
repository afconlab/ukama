/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present, Ukama Inc.
 */

package validationErrors

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_IsEmpty(t *testing.T) {
	// Success case
	check := IsEmpty("a", "b", "c")
	assert.False(t, check)

	_check := IsEmpty("", "", "c")
	assert.True(t, _check)

	__check := IsEmpty("", "", "")
	assert.True(t, __check)
}
func Test_IsInvalidId(t *testing.T) {
	// Success case
	check := IsReqEmpty(0)
	assert.True(t, check)

	_check := IsReqEmpty(1)
	assert.False(t, _check)
}
