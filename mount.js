import AnalyticsContext from '@root/core/src/contexts/analytics-context';
import MockAnalytics from '@root/global/test/support/mock-analytics';
import PropTypes from 'prop-types';
import React from 'react';
import { mount as enzymeMount } from 'enzyme';

const DEFAULT_CONTEXT = {
  configureHudNavigator: () => {},
};

const optionDefaults = {
  contextOverrides: {},
  withProviders: true,
};

const WrappingComponent = ({ children, analytics }) => {
  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

WrappingComponent.propTypes = {
  analytics: PropTypes.instanceOf(MockAnalytics),
  children: PropTypes.node,
};

WrappingComponent.defaultProps = {
  analytics: new MockAnalytics(),
};

export function mount(component, options = {}) {
  const renderOptions = Object.assign({}, optionDefaults, options);
  const enzymeOptions = {
    context: {
      ...DEFAULT_CONTEXT,
      ...renderOptions.contextOverrides,
    },
    childContextTypes: {
      configureHudNavigator: PropTypes.func.isRequired,
    },
  };

  if (renderOptions.withProviders) {
    enzymeOptions.wrappingComponent = WrappingComponent;
  }

  return enzymeMount(component, enzymeOptions);
}
