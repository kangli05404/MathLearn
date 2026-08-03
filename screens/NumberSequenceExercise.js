import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const TOTAL_QUESTIONS = 5;
const NUMBERS_PER_QUESTION = 4;

function randomNumber(minimum, maximum) {
    return (
        Math.floor(
            Math.random() *
            (maximum - minimum + 1)
        ) + minimum
    );
}

function shuffle(items) {
    return [...items].sort(
        () => Math.random() - 0.5
    );
}

function createQuestion() {
    const numberSet = new Set();

    while (
        numberSet.size <
        NUMBERS_PER_QUESTION
    ) {
        numberSet.add(randomNumber(1, 99));
    }

    const numbers = Array.from(numberSet);

    const direction =
        Math.random() < 0.5
            ? 'ascending'
            : 'descending';

    const correctOrder = [...numbers].sort(
        (firstNumber, secondNumber) => {
            if (direction === 'ascending') {
                return firstNumber - secondNumber;
            }

            return secondNumber - firstNumber;
        }
    );

    return {
        direction,
        numbers: shuffle(numbers),
        correctOrder,
    };
}

export default function NumberSequenceExercise({
    onBack,
    onComplete,
}) {
    const [question, setQuestion] =
        useState(createQuestion);

    const [
        questionNumber,
        setQuestionNumber,
    ] = useState(1);

    const [
        selectedNumbers,
        setSelectedNumbers,
    ] = useState([]);

    const [
        answerSubmitted,
        setAnswerSubmitted,
    ] = useState(false);

    const [
        answerIsCorrect,
        setAnswerIsCorrect,
    ] = useState(false);

    const [score, setScore] =
        useState(0);

    const [finished, setFinished] =
        useState(false);

    function selectNumber(number) {
        if (
            answerSubmitted ||
            selectedNumbers.includes(number)
        ) {
            return;
        }

        const newSelectedNumbers = [
            ...selectedNumbers,
            number,
        ];

        setSelectedNumbers(
            newSelectedNumbers
        );

        if (
            newSelectedNumbers.length ===
            NUMBERS_PER_QUESTION
        ) {
            const isCorrect =
                newSelectedNumbers.every(
                    (selectedNumber, index) =>
                        selectedNumber ===
                        question.correctOrder[index]
                );

            setAnswerIsCorrect(isCorrect);
            setAnswerSubmitted(true);

            if (isCorrect) {
                setScore(
                    (previousScore) =>
                        previousScore + 1
                );
            }
        }
    }

    function clearSelection() {
        if (!answerSubmitted) {
            setSelectedNumbers([]);
        }
    }

    function nextQuestion() {
        if (
            questionNumber ===
            TOTAL_QUESTIONS
        ) {
            setFinished(true);

            if (onComplete) {
                onComplete();
            }

            return;
        }

        setQuestion(createQuestion());

        setQuestionNumber(
            (previousQuestion) =>
                previousQuestion + 1
        );

        setSelectedNumbers([]);
        setAnswerSubmitted(false);
        setAnswerIsCorrect(false);
    }

    function tryAgain() {
        setQuestion(createQuestion());
        setQuestionNumber(1);
        setSelectedNumbers([]);
        setAnswerSubmitted(false);
        setAnswerIsCorrect(false);
        setScore(0);
        setFinished(false);
    }

    if (finished) {
        return (
            <View style={styles.resultScreen}>
                <StatusBar style="light" />

                <Text style={styles.resultEmoji}>
                    🌟
                </Text>

                <Text style={styles.resultTitle}>
                    Exercise Complete!
                </Text>

                <Text style={styles.resultScore}>
                    You scored {score} out of{' '}
                    {TOTAL_QUESTIONS}
                </Text>

                <Text style={styles.resultMessage}>
                    {score === TOTAL_QUESTIONS
                        ? 'Perfect! You are a sequencing expert!'
                        : 'Good effort! Keep practising!'}
                </Text>

                <Pressable
                    onPress={tryAgain}
                    style={({ pressed }) => [
                        styles.mainButton,
                        pressed &&
                        styles.mainButtonPressed,
                    ]}
                >
                    <Text
                        style={styles.mainButtonText}
                    >
                        Try Again
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed &&
                        styles.secondaryButtonPressed,
                    ]}
                >
                    <Text
                        style={
                            styles.secondaryButtonText
                        }
                    >
                        Return Home
                    </Text>
                </Pressable>
            </View>
        );
    }

    const directionInstruction =
        question.direction === 'ascending'
            ? 'smallest to biggest'
            : 'biggest to smallest';

    const directionTitle =
        question.direction === 'ascending'
            ? 'Ascending Order'
            : 'Descending Order';

    return (
        <View style={styles.screen}>
            <StatusBar style="light" />

            <ScrollView
                contentContainerStyle={
                    styles.page
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                <View style={styles.topBar}>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed &&
                            styles.backButtonPressed,
                        ]}
                    >
                        <Text
                            style={styles.backButtonText}
                        >
                            ← Back
                        </Text>
                    </Pressable>

                    <Text
                        style={styles.questionNumber}
                    >
                        {questionNumber} of{' '}
                        {TOTAL_QUESTIONS}
                    </Text>
                </View>

                <View
                    style={
                        styles.progressBackground
                    }
                >
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${(questionNumber /
                                    TOTAL_QUESTIONS) *
                                    100
                                    }%`,
                            },
                        ]}
                    />
                </View>

                <Text style={styles.title}>
                    Number Sequence
                </Text>

                <Text style={styles.instruction}>
                    {' '}
                    <Text
                        style={
                            styles.highlightedDirection
                        }
                    >
                        {directionInstruction}
                    </Text>
                    .
                </Text>

                <View
                    style={styles.directionBadge}
                >
                    <Text
                        style={styles.directionText}
                    >
                        {question.direction ===
                            'ascending'
                            ? '↑'
                            : '↓'}{' '}
                        {directionTitle}
                    </Text>
                </View>

                <View
                    style={styles.selectionCard}
                >
                    <Text
                        style={styles.selectionLabel}
                    >
                        Your order
                    </Text>

                    {selectedNumbers.length === 0 ? (
                        <Text
                            style={
                                styles.emptySelection
                            }
                        >
                            Tap a number to begin
                        </Text>
                    ) : (
                        <View
                            style={
                                styles.selectedNumberRow
                            }
                        >
                            {selectedNumbers.map(
                                (
                                    selectedNumber,
                                    index
                                ) => (
                                    <View
                                        key={selectedNumber}
                                        style={
                                            styles.selectedSequenceTile
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.selectedSequenceText
                                            }
                                        >
                                            {selectedNumber}
                                        </Text>

                                        <View
                                            style={
                                                styles.orderBadge
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.orderBadgeText
                                                }
                                            >
                                                {index + 1}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            )}
                        </View>
                    )}

                    {selectedNumbers.length > 0 &&
                        !answerSubmitted && (
                            <Pressable
                                onPress={clearSelection}
                                style={({ pressed }) => [
                                    styles.clearButton,
                                    pressed &&
                                    styles.clearButtonPressed,
                                ]}
                            >
                                <Text
                                    style={
                                        styles.clearButtonText
                                    }
                                >
                                    Clear selection
                                </Text>
                            </Pressable>
                        )}
                </View>

                <Text style={styles.chooseText}>
                    Tap the numbers in order
                </Text>

                <View style={styles.numberGrid}>
                    {question.numbers.map(
                        (number) => {
                            const hasBeenSelected =
                                selectedNumbers.includes(
                                    number
                                );

                            return (
                                <Pressable
                                    key={number}
                                    disabled={
                                        hasBeenSelected ||
                                        answerSubmitted
                                    }
                                    onPress={() =>
                                        selectNumber(number)
                                    }
                                    style={({ pressed }) => [
                                        styles.numberButton,

                                        pressed &&
                                        !answerSubmitted &&
                                        !hasBeenSelected &&
                                        styles.numberButtonPressed,

                                        hasBeenSelected &&
                                        styles.selectedNumberButton,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.numberButtonText,

                                            hasBeenSelected &&
                                            styles.selectedNumberText,
                                        ]}
                                    >
                                        {number}
                                    </Text>
                                </Pressable>
                            );
                        }
                    )}
                </View>

                {answerSubmitted && (
                    <View
                        style={[
                            styles.feedbackBox,

                            answerIsCorrect
                                ? styles.correctFeedback
                                : styles.wrongFeedback,
                        ]}
                    >
                        <Text
                            style={
                                styles.feedbackTitle
                            }
                        >
                            {answerIsCorrect
                                ? 'Correct! 🎉'
                                : 'Good Try!'}
                        </Text>

                        <Text
                            style={styles.feedbackText}
                        >
                            The correct order is{' '}
                            {question.correctOrder.join(
                                ', '
                            )}
                            .
                        </Text>
                    </View>
                )}

                {answerSubmitted && (
                    <Pressable
                        onPress={nextQuestion}
                        style={({ pressed }) => [
                            styles.mainButton,
                            pressed &&
                            styles.mainButtonPressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.mainButtonText
                            }
                        >
                            {questionNumber ===
                                TOTAL_QUESTIONS
                                ? 'See Results'
                                : 'Next Question'}
                        </Text>
                    </Pressable>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#F8F1FC',
        flex: 1,
    },

    page: {
        paddingBottom: 40,
        paddingHorizontal: 20,
        paddingTop: 30,
    },

    topBar: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    backButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#CFB4DC',
        borderRadius: 18,
        borderWidth: 2,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 9,
        shadowColor: '#70418B',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },

    backButtonPressed: {
        opacity: 0.75,
        transform: [
            {
                scale: 0.97,
            },
        ],
    },

    backButtonText: {
        color: '#70418B',
        fontSize: 15,
        fontWeight: '700',
    },

    questionNumber: {
        color: '#765F83',
        fontSize: 15,
        fontWeight: '700',
    },

    progressBackground: {
        backgroundColor: '#E6D7EE',
        borderRadius: 10,
        height: 10,
        marginBottom: 28,
        marginTop: 18,
        overflow: 'hidden',
    },

    progressFill: {
        backgroundColor: '#9B59B6',
        borderRadius: 10,
        height: '100%',
    },

    title: {
        color: '#3D2948',
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
    },

    instruction: {
        color: '#765F83',
        fontSize: 18,
        lineHeight: 29,
        marginTop: 10,
        textAlign: 'center',
    },

    highlightedDirection: {
        color: '#8A3FB0',
        fontSize: 20,
        fontWeight: '900',
        textShadowColor: '#E4C9F1',
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 3,
    },

    directionBadge: {
        alignSelf: 'center',
        backgroundColor: '#F0E2F7',
        borderColor: '#C99ADA',
        borderRadius: 16,
        borderWidth: 2,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },

    directionText: {
        color: '#8A3FB0',
        fontSize: 17,
        fontWeight: '900',
        textAlign: 'center',
    },

    selectionCard: {
        alignItems: 'center',
        backgroundColor: '#FCF9FE',
        borderColor: '#D6BCE1',
        borderRadius: 24,
        borderWidth: 2,
        elevation: 4,
        justifyContent: 'center',
        marginTop: 22,
        minHeight: 170,
        padding: 20,
        shadowColor: '#70418B',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },

    selectionLabel: {
        color: '#765F83',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    emptySelection: {
        color: '#9A8CA2',
        fontSize: 16,
        marginTop: 18,
    },

    selectedNumberRow: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
    },

    selectedSequenceTile: {
        alignItems: 'center',
        backgroundColor: '#F4EAF9',
        borderBottomWidth: 5,
        borderColor: '#A96AC2',
        borderRadius: 17,
        borderWidth: 3,
        elevation: 3,
        height: 62,
        justifyContent: 'center',
        margin: 4,
        shadowColor: '#70418B',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        width: 62,
    },

    selectedSequenceText: {
        color: '#633378',
        fontSize: 23,
        fontWeight: '900',
    },

    orderBadge: {
        alignItems: 'center',
        backgroundColor: '#9B59B6',
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        position: 'absolute',
        right: -5,
        top: -7,
        width: 20,
    },

    orderBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
    },

    clearButton: {
        backgroundColor: '#F1E3F7',
        borderColor: '#C99ADA',
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 15,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    clearButtonPressed: {
        opacity: 0.7,
        transform: [
            {
                scale: 0.97,
            },
        ],
    },

    clearButtonText: {
        color: '#8A3FB0',
        fontSize: 14,
        fontWeight: '800',
    },

    chooseText: {
        color: '#3D2948',
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 15,
        marginTop: 28,
        textAlign: 'center',
    },

    numberGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 14,
    },

    numberButton: {
        alignItems: 'center',
        backgroundColor: '#FCF9FE',
        borderBottomWidth: 7,
        borderColor: '#BE8ED1',
        borderRadius: 20,
        borderWidth: 3,
        elevation: 5,
        justifyContent: 'center',
        minHeight: 78,
        shadowColor: '#70418B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        width: '48%',
    },

    numberButtonPressed: {
        opacity: 0.9,
        transform: [
            {
                translateY: 4,
            },
            {
                scale: 0.98,
            },
        ],
    },

    selectedNumberButton: {
        backgroundColor: '#9B59B6',
        borderBottomColor: '#5E2D75',
        borderColor: '#70418B',
    },

    numberButtonText: {
        color: '#3D2948',
        fontSize: 28,
        fontWeight: '900',
    },

    selectedNumberText: {
        color: '#FFFFFF',
    },

    feedbackBox: {
        borderRadius: 18,
        marginTop: 22,
        padding: 16,
    },

    correctFeedback: {
        backgroundColor: '#DDF5E0',
    },

    wrongFeedback: {
        backgroundColor: '#FFE0E0',
    },

    feedbackTitle: {
        color: '#3D2948',
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },

    feedbackText: {
        color: '#765F83',
        fontSize: 15,
        lineHeight: 22,
        marginTop: 4,
        textAlign: 'center',
    },

    mainButton: {
        alignItems: 'center',
        backgroundColor: '#9B59B6',
        borderBottomWidth: 5,
        borderColor: '#6F3787',
        borderRadius: 20,
        borderWidth: 2,
        elevation: 5,
        marginTop: 22,
        padding: 16,
        shadowColor: '#70418B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4,
    },

    mainButtonPressed: {
        opacity: 0.88,
        transform: [
            {
                translateY: 3,
            },
            {
                scale: 0.99,
            },
        ],
    },

    mainButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '900',
    },

    secondaryButton: {
        alignItems: 'center',
        marginTop: 14,
        padding: 14,
    },

    secondaryButtonPressed: {
        opacity: 0.65,
    },

    secondaryButtonText: {
        color: '#70418B',
        fontSize: 16,
        fontWeight: '800',
    },

    resultScreen: {
        alignItems: 'center',
        backgroundColor: '#F8F1FC',
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },

    resultEmoji: {
        fontSize: 80,
    },

    resultTitle: {
        color: '#3D2948',
        fontSize: 30,
        fontWeight: '900',
        marginTop: 20,
        textAlign: 'center',
    },

    resultScore: {
        color: '#70418B',
        fontSize: 21,
        fontWeight: '800',
        marginTop: 14,
        textAlign: 'center',
    },

    resultMessage: {
        color: '#765F83',
        fontSize: 17,
        lineHeight: 25,
        marginTop: 10,
        textAlign: 'center',
    },
});