// Code generated by mockery v2.28.0. DO NOT EDIT.

package mocks

import (
	mock "github.com/stretchr/testify/mock"
	gen "github.com/ukama/ukama/systems/subscriber/sim-manager/pb/gen"
)

// SimManagerClientProvider is an autogenerated mock type for the SimManagerClientProvider type
type SimManagerClientProvider struct {
	mock.Mock
}

// GetSimManagerService provides a mock function with given fields:
func (_m *SimManagerClientProvider) GetSimManagerService() (gen.SimManagerServiceClient, error) {
	ret := _m.Called()

	var r0 gen.SimManagerServiceClient
	var r1 error
	if rf, ok := ret.Get(0).(func() (gen.SimManagerServiceClient, error)); ok {
		return rf()
	}
	if rf, ok := ret.Get(0).(func() gen.SimManagerServiceClient); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(gen.SimManagerServiceClient)
		}
	}

	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

type mockConstructorTestingTNewSimManagerClientProvider interface {
	mock.TestingT
	Cleanup(func())
}

// NewSimManagerClientProvider creates a new instance of SimManagerClientProvider. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewSimManagerClientProvider(t mockConstructorTestingTNewSimManagerClientProvider) *SimManagerClientProvider {
	mock := &SimManagerClientProvider{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
