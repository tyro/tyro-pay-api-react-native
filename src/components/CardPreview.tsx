import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { ImageSources } from '../@types/images';
import { SupportedNetworks } from '../@types/tyro-sdk';

type CardPreviewProps = {
  supportedNetworks: SupportedNetworks[];
};

const CardPreview = ({ supportedNetworks }: CardPreviewProps): JSX.Element => {
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [prevIdx, setPrevIdx] = useState<number>(-1);
  const fadeInOpacity = useRef(new Animated.Value(0)).current;
  const fadeOutOpacity = useRef(new Animated.Value(1)).current;
  let ImageElementIn = ImageSources[supportedNetworks[currIdx]];
  let ImageElementOut = prevIdx >= 0 && ImageSources[supportedNetworks[prevIdx]];

  const AnimateImagePreview = (): void => {
    Animated.parallel([
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeOutOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const temp = currIdx;
      setCurrIdx((prev) => (prev + 1) % supportedNetworks.length);
      setPrevIdx(temp);
      fadeInOpacity.setValue(0);
      fadeOutOpacity.setValue(1);
    });
  };

  useEffect(() => {
    ImageElementIn = ImageSources[supportedNetworks[currIdx]];
    ImageElementOut = prevIdx >= 0 && ImageSources[supportedNetworks[prevIdx]];
    AnimateImagePreview();
  }, [prevIdx]);

  return (
    <View>
      <Animated.View
        style={{
          opacity: fadeInOpacity,
        }}
      >
        {ImageElementIn && <ImageElementIn />}
      </Animated.View>

      {ImageElementOut && (
        <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            opacity: fadeOutOpacity,
          }}
        >
          <ImageElementOut />
        </Animated.View>
      )}
    </View>
  );
};

export default CardPreview;
