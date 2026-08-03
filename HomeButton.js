import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

export default function HomeButton({ onPress }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Return to home"
            hitSlop={8}
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            <View style={styles.innerBorder} />

            <View style={styles.homeIcon}>
                <View style={styles.roof} />
                <View style={styles.house} />
                <View style={styles.door} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#FF682C',
        borderBottomWidth: 6,
        borderColor: '#B83B18',
        borderRadius: 31,
        borderWidth: 3,
        elevation: 7,
        height: 62,
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        width: 62,
    },

    buttonPressed: {
        opacity: 0.9,
        transform: [
            {
                translateY: 3,
            },
            {
                scale: 0.97,
            },
        ],
    },

    innerBorder: {
        borderColor: 'rgba(255, 255, 255, 0.55)',
        borderRadius: 25,
        borderWidth: 2,
        bottom: 5,
        left: 3,
        position: 'absolute',
        right: 3,
        top: 3,
    },

    homeIcon: {
        height: 46,
        marginBottom: 2,
        position: 'relative',
        width: 46,
    },

    roof: {
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        height: 26,
        left: 10,
        position: 'absolute',
        top: 5,
        transform: [
            {
                rotate: '45deg',
            },
        ],
        width: 26,
        zIndex: 1,
    },

    house: {
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        bottom: 3,
        height: 24,
        left: 8,
        position: 'absolute',
        width: 30,
        zIndex: 2,
    },

    door: {
        backgroundColor: '#FF682C',
        bottom: 3,
        height: 14,
        left: 19,
        position: 'absolute',
        width: 8,
        zIndex: 3,
    },
});