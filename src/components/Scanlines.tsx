import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Replicates the CSS scanline effect:
 * body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,245,255,0.012) 2px,rgba(0,245,255,0.012) 4px);pointer-events:none;z-index:9999;}
 */
export function Scanlines() {
    const lineCount = Math.ceil(height / 4);
    const lines = Array.from({ length: lineCount });

    return (
        <View style={styles.container} pointerEvents="none">
            {lines.map((_, i) => (
                <View key={i} style={styles.line} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    line: {
        height: 2,
        backgroundColor: 'rgba(0,245,255,0.012)',
        marginBottom: 2,
    },
});
