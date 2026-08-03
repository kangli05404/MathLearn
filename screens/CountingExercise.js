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

const objectTypes = [
    {
        emoji: '🍎',
        name: 'apples',
    },
    {
        emoji: '⭐',
        name: 'stars',
    },
    {
        emoji: '⚽',
        name: 'balls',
    },
    {
        emoji: '🐟',
        name: 'fish',
    },
    {
        emoji: '🌸',
        name: 'flowers',
    },
];

function randomNumber(minimum, maximum) {
    return (
        Math.floor(
            Math.random() *
            (maximum - minimum + 1)
        ) + minimum
    );
}

function createAnswerChoices(
    correctAnswer
) {
    const answers = new Set([
        correctAnswer,
    ]);

    while (answers.size < 3) {
        answers.add(randomNumber(1, 9));
    }

    return Array.from(answers).sort(
        () => Math.random() - 0.5
    );
}

function createQuestion() {
    const count = randomNumber(1, 9);

    const objectIndex = randomNumber(
        0,
        objectTypes.length - 1
    );

    return {
        count,
        object: objectTypes[objectIndex],
        answers:
            createAnswerChoices(count),
    };
}

export default function CountingExercise({
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
        selectedAnswer,
        setSelectedAnswer,
    ] = useState(null);

    const [score, setScore] =
        useState(0);

    const [finished, setFinished] =
        useState(false);

    function selectAnswer(answer) {
        if (selectedAnswer !== null) {
            return;
        }

        setSelectedAnswer(answer);

        if (answer === question.count) {
            setScore(
                (previousScore) =>
                    previousScore + 1
            );
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

        setSelectedAnswer(null);
    }

    function tryAgain() {
        setQuestion(createQuestion());
        setQuestionNumber(1);
        setSelectedAnswer(null);
        setScore(0);
        setFinished(false);
    }

    if (finished) {
        return (
            <View style={styles.resultScreen}>
                <StatusBar style="light" />

                <Text style={styles.resultEmoji}>
                    🏆
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
                        ? 'Perfect! You are a counting champion!'
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

    const answerIsCorrect =
        selectedAnswer === question.count;

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
                    Count the Objects
                </Text>

                <Text style={styles.instruction}>
                    How many{' '}
                    <Text
                        style={
                            styles.highlightedObject
                        }
                    >
                        {question.object.emoji}{' '}
                        {question.object.name}
                    </Text>{' '}
                    can you see?
                </Text>

                <View style={styles.objectBox}>
                    {Array.from(
                        {
                            length: question.count,
                        },
                        (_, index) => (
                            <View
                                key={index}
                                style={styles.objectTile}
                            >
                                <Text
                                    style={
                                        styles.objectEmoji
                                    }
                                >
                                    {question.object.emoji}
                                </Text>
                            </View>
                        )
                    )}
                </View>

                <Text style={styles.chooseText}>
                    Choose your answer
                </Text>

                <View style={styles.answerRow}>
                    {question.answers.map(
                        (answer) => {
                            const isCorrectAnswer =
                                answer === question.count;

                            const
                                isWrongSelectedAnswer =
                                    answer ===
                                    selectedAnswer &&
                                    answer !==
                                    question.count;

                            return (
                                <Pressable
                                    key={answer}
                                    disabled={
                                        selectedAnswer !==
                                        null
                                    }
                                    onPress={() =>
                                        selectAnswer(answer)
                                    }
                                    style={({ pressed }) => [
                                        styles.answerButton,

                                        pressed &&
                                        selectedAnswer ===
                                        null &&
                                        styles.answerButtonPressed,

                                        selectedAnswer !==
                                        null &&
                                        isCorrectAnswer &&
                                        styles.correctAnswer,

                                        isWrongSelectedAnswer &&
                                        styles.wrongAnswer,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.answerText
                                        }
                                    >
                                        {answer}
                                    </Text>
                                </Pressable>
                            );
                        }
                    )}
                </View>

                {selectedAnswer !== null && (
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
                            {answerIsCorrect
                                ? 'Great counting!'
                                : `The correct answer is ${question.count}.`}
                        </Text>
                    </View>
                )}

                {selectedAnswer !== null && (
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
        backgroundColor: '#FFF8E7',
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
        borderColor: '#E8C68E',
        borderRadius: 18,
        borderWidth: 2,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 9,
        shadowColor: '#8A4F00',
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
        color: '#4D3319',
        fontSize: 15,
        fontWeight: '700',
    },

    questionNumber: {
        color: '#665F56',
        fontSize: 15,
        fontWeight: '700',
    },

    progressBackground: {
        backgroundColor: '#E8DED0',
        borderRadius: 10,
        height: 10,
        marginBottom: 28,
        marginTop: 18,
        overflow: 'hidden',
    },

    progressFill: {
        backgroundColor: '#F59E42',
        borderRadius: 10,
        height: '100%',
    },

    title: {
        color: '#302A24',
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
    },

    instruction: {
        color: '#665F56',
        fontSize: 18,
        lineHeight: 29,
        marginTop: 10,
        textAlign: 'center',
    },

    highlightedObject: {
        color: '#D97000',
        fontSize: 20,
        fontWeight: '900',
        textShadowColor: '#FFE0A3',
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 3,
    },

    objectBox: {
        alignItems: 'center',
        backgroundColor: '#FFFDF8',
        borderColor: '#F0D19D',
        borderRadius: 24,
        borderWidth: 2,
        elevation: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 26,
        minHeight: 210,
        padding: 20,
        shadowColor: '#8A4F00',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },

    objectTile: {
        alignItems: 'center',
        backgroundColor: '#FFF8E7',
        borderBottomWidth: 4,
        borderColor: '#E8BD79',
        borderRadius: 18,
        borderWidth: 2,
        elevation: 3,
        height: 62,
        justifyContent: 'center',
        margin: 6,
        shadowColor: '#8A4F00',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        width: 62,
    },

    objectEmoji: {
        fontSize: 38,
    },

    chooseText: {
        color: '#302A24',
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 15,
        marginTop: 28,
        textAlign: 'center',
    },

    answerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    answerButton: {
        alignItems: 'center',
        backgroundColor: '#FFFDF8',
        borderBottomWidth: 7,
        borderColor: '#E8B96F',
        borderRadius: 20,
        borderWidth: 3,
        elevation: 5,
        justifyContent: 'center',
        minHeight: 78,
        shadowColor: '#8A4F00',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        width: '30%',
    },

    answerButtonPressed: {
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

    correctAnswer: {
        backgroundColor: '#DDF5E0',
        borderBottomColor: '#2F7D35',
        borderColor: '#4CAF50',
    },

    wrongAnswer: {
        backgroundColor: '#FFE1D6',
        borderBottomColor: '#B9432D',
        borderColor: '#E76F51',
    },

    answerText: {
        color: '#302A24',
        fontSize: 28,
        fontWeight: '900',
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
        color: '#302A24',
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },

    feedbackText: {
        color: '#665F56',
        fontSize: 15,
        marginTop: 4,
        textAlign: 'center',
    },

    mainButton: {
        alignItems: 'center',
        backgroundColor: '#F59E42',
        borderBottomWidth: 5,
        borderColor: '#C86E1A',
        borderRadius: 20,
        borderWidth: 2,
        elevation: 5,
        marginTop: 22,
        padding: 16,
        shadowColor: '#8A4F00',
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
        color: '#8A4F00',
        fontSize: 16,
        fontWeight: '800',
    },

    resultScreen: {
        alignItems: 'center',
        backgroundColor: '#FFF8E7',
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },

    resultEmoji: {
        fontSize: 80,
    },

    resultTitle: {
        color: '#302A24',
        fontSize: 30,
        fontWeight: '900',
        marginTop: 20,
        textAlign: 'center',
    },

    resultScore: {
        color: '#8A4F00',
        fontSize: 21,
        fontWeight: '800',
        marginTop: 14,
        textAlign: 'center',
    },

    resultMessage: {
        color: '#665F56',
        fontSize: 17,
        lineHeight: 25,
        marginTop: 10,
        textAlign: 'center',
    },
});