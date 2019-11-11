
import PropTypes from 'prop-types';
import React from 'react';
import press from '@root/global/test/support/press';
import useAnalytics from '@root/core/src/hooks/use-analytics';
import { TouchableOpacity } from 'react-native';
import { mount } from '@root/global/test/support/mount';

const TestComponent = ({ eventPrefix }) => {
  const [track] = useAnalytics(eventPrefix);
  return (
    <TouchableOpacity
      onPress={() => track('BUTTON_PRESSED', {
        hello: true,
      })}
      testID={'test-button'}
    />
  );
};

TestComponent.propTypes = {
  eventPrefix: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

describe('useAnalytics', () => {
  let analytics;

  const mountComponent = (overrides = {}, options = {}) => {
    const wrapper = mount(
      <TestComponent {...overrides} />,
      {
        withProviders: true,
        ...options,
      }
    );
    analytics = wrapper.getWrappingComponent().props().analytics;

    return wrapper;
  };

  it('throws an error if the AnalyticsContext is not available', () => {
    expect(() => {
      mountComponent({}, {
        withProviders: false,
      });
    }).to.throw();
  });

  describe('when hook is used without overriding view options', () => {
    it('tracks the viewed event with string event prefix', () => {
      mountComponent({
        eventPrefix: 'TEST_COMPONENT',
      });

      expect(analytics.lastEvent.event).to.eq('TEST_COMPONENT_VIEWED');
    });

    it('tracks the viewed event with functional event prefix', () => {
      const sceneName = 'ABOUT';
      mountComponent({
        eventPrefix: (event) => `${sceneName}_SCREEN_${event}`,
      });

      expect(analytics.lastEvent.event).to.eq('ABOUT_SCREEN_VIEWED');
    });

    it('tracks correctly when track is called from the return of the hook', async () => {
      const wrapper = mountComponent({
        eventPrefix: 'TEST_COMPONENT',
      });

      press(wrapper, 'test-button');

      expect(analytics.lastEvent).to.eql({
        event: 'TEST_COMPONENT_BUTTON_PRESSED',
        properties: {
          hello: true,
        },
      });
    });
  });

  it('when given an invalid event prefix throws', () => {
    expect(() => {
      mountComponent({
        eventPrefix: null,
      });
    }).to.throw('Invalid event prefix given to useAnalytics hook');
  });
});
