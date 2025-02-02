// Code generated by mockery v2.20.0. DO NOT EDIT.

package mocks

import (
	mock "github.com/stretchr/testify/mock"

	ukama "github.com/ukama/ukama/systems/common/pb/gen/ukama"
)

// RequestExecutor is an autogenerated mock type for the RequestExecutor type
type RequestExecutor struct {
	mock.Mock
}

// Execute provides a mock function with given fields: req
func (_m *RequestExecutor) Execute(req *ukama.NodeFeederMessage) error {
	ret := _m.Called(req)

	var r0 error
	if rf, ok := ret.Get(0).(func(*ukama.NodeFeederMessage) error); ok {
		r0 = rf(req)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

type mockConstructorTestingTNewRequestExecutor interface {
	mock.TestingT
	Cleanup(func())
}

// NewRequestExecutor creates a new instance of RequestExecutor. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewRequestExecutor(t mockConstructorTestingTNewRequestExecutor) *RequestExecutor {
	mock := &RequestExecutor{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
