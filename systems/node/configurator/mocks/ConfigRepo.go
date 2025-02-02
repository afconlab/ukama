// Code generated by mockery v2.20.0. DO NOT EDIT.

package mocks

import (
	mock "github.com/stretchr/testify/mock"
	db "github.com/ukama/ukama/systems/node/configurator/pkg/db"
)

// ConfigRepo is an autogenerated mock type for the ConfigRepo type
type ConfigRepo struct {
	mock.Mock
}

// Add provides a mock function with given fields: id
func (_m *ConfigRepo) Add(id string) error {
	ret := _m.Called(id)

	var r0 error
	if rf, ok := ret.Get(0).(func(string) error); ok {
		r0 = rf(id)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Delete provides a mock function with given fields: id
func (_m *ConfigRepo) Delete(id string) error {
	ret := _m.Called(id)

	var r0 error
	if rf, ok := ret.Get(0).(func(string) error); ok {
		r0 = rf(id)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Get provides a mock function with given fields: id
func (_m *ConfigRepo) Get(id string) (*db.Configuration, error) {
	ret := _m.Called(id)

	var r0 *db.Configuration
	var r1 error
	if rf, ok := ret.Get(0).(func(string) (*db.Configuration, error)); ok {
		return rf(id)
	}
	if rf, ok := ret.Get(0).(func(string) *db.Configuration); ok {
		r0 = rf(id)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*db.Configuration)
		}
	}

	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(id)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetAll provides a mock function with given fields:
func (_m *ConfigRepo) GetAll() ([]db.Configuration, error) {
	ret := _m.Called()

	var r0 []db.Configuration
	var r1 error
	if rf, ok := ret.Get(0).(func() ([]db.Configuration, error)); ok {
		return rf()
	}
	if rf, ok := ret.Get(0).(func() []db.Configuration); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]db.Configuration)
		}
	}

	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// UpdateCommitState provides a mock function with given fields: nodeid, state
func (_m *ConfigRepo) UpdateCommitState(nodeid string, state db.CommitState) error {
	ret := _m.Called(nodeid, state)

	var r0 error
	if rf, ok := ret.Get(0).(func(string, db.CommitState) error); ok {
		r0 = rf(nodeid, state)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// UpdateCurrentCommit provides a mock function with given fields: c, state
func (_m *ConfigRepo) UpdateCurrentCommit(c db.Configuration, state *db.CommitState) error {
	ret := _m.Called(c, state)

	var r0 error
	if rf, ok := ret.Get(0).(func(db.Configuration, *db.CommitState) error); ok {
		r0 = rf(c, state)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// UpdateLastCommit provides a mock function with given fields: c, state
func (_m *ConfigRepo) UpdateLastCommit(c db.Configuration, state *db.CommitState) error {
	ret := _m.Called(c, state)

	var r0 error
	if rf, ok := ret.Get(0).(func(db.Configuration, *db.CommitState) error); ok {
		r0 = rf(c, state)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// UpdateLastCommitState provides a mock function with given fields: nodeid, state
func (_m *ConfigRepo) UpdateLastCommitState(nodeid string, state db.CommitState) error {
	ret := _m.Called(nodeid, state)

	var r0 error
	if rf, ok := ret.Get(0).(func(string, db.CommitState) error); ok {
		r0 = rf(nodeid, state)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

type mockConstructorTestingTNewConfigRepo interface {
	mock.TestingT
	Cleanup(func())
}

// NewConfigRepo creates a new instance of ConfigRepo. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewConfigRepo(t mockConstructorTestingTNewConfigRepo) *ConfigRepo {
	mock := &ConfigRepo{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
