import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

/**
 * Replicates the CSS grid effect:
 * body::after{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,245,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.025) 1px,transparent 1px);background-size:44px 44px;pointer-events:none;z-index:0;}
 */
export function BackgroundGrid() {
    return (
        <View style={styles.container} pointerEvents="none">
            <Svg width="100%" height="100%">
                <Defs>
                    <Pattern
                        id="grid"
                        width="44"
                        height="44"
                        patternUnits="userSpaceOnUse"
                    >
                        <Path
                            d="M 44 0 L 0 0 0 44"
                            fill="none"
                            stroke="rgba(0,245,255,0.025)"
                            strokeWidth="1"
                        />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grid)" />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
});
