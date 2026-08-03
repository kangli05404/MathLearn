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
        answers.add(randomNumber(0, 9));
    }

    return Array.from(answers).sort(
        () => Math.random() - 0.5
    );
}

function createQuestion() {
    const number = randomNumber(10, 99);

    const tens = Math.floor(number / 10);
    const ones = number % 10;

    const place =Math.random() < 0.5? 'tens': 'ones';

    const correctAnswer = place === 'tens' ? tens : ones;

    return {number,tens,ones,place,correctAnswer,answers:createAnswerChoices(correctAnswer),};
}

export default function PlaceValueExercise({
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

        if (
            answer === question.correctAnswer
        ) {
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
                        ? 'Perfect! You understand place value!'
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
        selectedAnswer ===
        question.correctAnswer;

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
                    Place Value
                </Text>

                <Text style={styles.instruction}>
                    Which digit is in the{' '}
                    <Text
                        style={
                            styles.highlightedPlace
                        }
                    >
                        {question.place}
                    </Text>{' '}
                    place?
                </Text>

                <View style={styles.numberCard}>
                    <View style={styles.digitRow}>
                        <View style={styles.digitTile}>
                            <Text style={styles.digit}>
                                {question.tens}
                            </Text>
                        </View>

                        <View style={styles.digitTile}>
                            <Text style={styles.digit}>
                                {question.ones}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.numberHint}>
                        Each digit has its own place
                    </Text>
                </View>

                <Text style={styles.chooseText}>
                    Choose your answer
                </Text>

                <View style={styles.answerRow}>
                    {question.answers.map(
                        (answer) => {
                            const isCorrectAnswer =
                                answer ===
                                question.correctAnswer;

                            const
                                isWrongSelectedAnswer =
                                    answer ===
                                    selectedAnswer &&
                                    answer !==
                                    question.correctAnswer;

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
                            {question.number} has{' '}
                            {question.tens}{' '}
                            {question.tens === 1
                                ? 'ten'
                                : 'tens'}{' '}
                            and {question.ones}{' '}
                            {question.ones === 1
                                ? 'one'
                                : 'ones'}.
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
        backgroundColor: '#F1FAF2',
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
        borderColor: '#A6D4AC',
        borderRadius: 18,
        borderWidth: 2,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 9,
        shadowColor: '#285430',
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
        color: '#285430',
        fontSize: 15,
        fontWeight: '700',
    },

    questionNumber: {
        color: '#52705A',
        fontSize: 15,
        fontWeight: '700',
    },

    progressBackground: {
        backgroundColor: '#D8E8DA',
        borderRadius: 10,
        height: 10,
        marginBottom: 28,
        marginTop: 18,
        overflow: 'hidden',
    },

    progressFill: {
        backgroundColor: '#5EAD69',
        borderRadius: 10,
        height: '100%',
    },

    title: {
        color: '#213B27',
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
    },

    instruction: {
        color: '#52705A',
        fontSize: 18,
        lineHeight: 29,
        marginTop: 10,
        textAlign: 'center',
    },

    highlightedPlace: {
        color: '#2D8B3C',
        fontSize: 20,
        fontWeight: '900',
        textShadowColor: '#C8EFCF',
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 3,
        textTransform: 'uppercase',
    },

    numberCard: {
        alignItems: 'center',
        backgroundColor: '#FBFFFB',
        borderColor: '#B6DDBB',
        borderRadius: 24,
        borderWidth: 2,
        elevation: 4,
        justifyContent: 'center',
        marginTop: 26,
        minHeight: 210,
        padding: 24,
        shadowColor: '#285430',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },

    digitRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },

    digitTile: {
        alignItems: 'center',
        backgroundColor: '#F1FAF2',
        borderBottomWidth: 6,
        borderColor: '#78B982',
        borderRadius: 22,
        borderWidth: 3,
        elevation: 4,
        height: 85,
        justifyContent: 'center',
        marginHorizontal: 8,
        shadowColor: '#285430',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 4,
        width: 90,
    },

    digit: {
        color: '#285430',
        fontSize: 50,
        fontWeight: '900',
    },

    numberHint: {
        color: '#6F8174',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 18,
    },

    chooseText: {
        color: '#213B27',
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
        backgroundColor: '#FBFFFB',
        borderBottomWidth: 7,
        borderColor: '#8DC596',
        borderRadius: 20,
        borderWidth: 3,
        elevation: 5,
        justifyContent: 'center',
        minHeight: 78,
        shadowColor: '#285430',
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
        color: '#213B27',
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
        color: '#213B27',
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },

    feedbackText: {
        color: '#52705A',
        fontSize: 15,
        lineHeight: 22,
        marginTop: 4,
        textAlign: 'center',
    },

    mainButton: {
        alignItems: 'center',
        backgroundColor: '#5EAD69',
        borderBottomWidth: 5,
        borderColor: '#347A40',
        borderRadius: 20,
        borderWidth: 2,
        elevation: 5,
        marginTop: 22,
        padding: 16,
        shadowColor: '#285430',
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
        color: '#285430',
        fontSize: 16,
        fontWeight: '800',
    },

    resultScreen: {
        alignItems: 'center',
        backgroundColor: '#F1FAF2',
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },

    resultEmoji: {
        fontSize: 80,
    },

    resultTitle: {
        color: '#213B27',
        fontSize: 30,
        fontWeight: '900',
        marginTop: 20,
        textAlign: 'center',
    },

    resultScore: {
        color: '#285430',
        fontSize: 21,
        fontWeight: '800',
        marginTop: 14,
        textAlign: 'center',
    },

    resultMessage: {
        color: '#52705A',
        fontSize: 17,
        lineHeight: 25,
        marginTop: 10,
        textAlign: 'center',
    },
});