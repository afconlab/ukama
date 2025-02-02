// Code generated by mockery v2.28.0. DO NOT EDIT.

package mocks

import (
	mock "github.com/stretchr/testify/mock"
	gen "github.com/ukama/ukama/systems/registry/network/pb/gen"
)

// NetworkClientProvider is an autogenerated mock type for the NetworkClientProvider type
type NetworkClientProvider struct {
	mock.Mock
}

// GetClient provides a mock function with given fields:
func (_m *NetworkClientProvider) GetClient() (gen.NetworkServiceClient, error) {
	ret := _m.Called()

	var r0 gen.NetworkServiceClient
	var r1 error
	if rf, ok := ret.Get(0).(func() (gen.NetworkServiceClient, error)); ok {
		return rf()
	}
	if rf, ok := ret.Get(0).(func() gen.NetworkServiceClient); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(gen.NetworkServiceClient)
		}
	}

	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

type mockConstructorTestingTNewNetworkClientProvider interface {
	mock.TestingT
	Cleanup(func())
}

// NewNetworkClientProvider creates a new instance of NetworkClientProvider. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewNetworkClientProvider(t mockConstructorTestingTNewNetworkClientProvider) *NetworkClientProvider {
	mock := &NetworkClientProvider{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
