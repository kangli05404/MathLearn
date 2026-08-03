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

const smallNumbers = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
];

const tensWords = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
];

function randomNumber(minimum, maximum) {
    return (
        Math.floor(
            Math.random() *
            (maximum - minimum + 1)
        ) + minimum
    );
}

function numberToWords(number) {
    if (number < 20) {
        return smallNumbers[number];
    }

    const tensDigit = Math.floor(
        number / 10
    );

    const onesDigit = number % 10;

    if (onesDigit === 0) {
        return tensWords[tensDigit];
    }

    return `${tensWords[tensDigit]}-${smallNumbers[onesDigit]}`;
}

function shuffle(items) {
    return [...items].sort(
        () => Math.random() - 0.5
    );
}

function createNumberChoices(
    correctNumber
) {
    const numbers = new Set([
        correctNumber,
    ]);

    while (numbers.size < 3) {
        numbers.add(randomNumber(1, 99));
    }

    return Array.from(numbers);
}

function createQuestion() {
    const number = randomNumber(1, 99);

    const questionType =
        Math.random() < 0.5
            ? 'numberToWord'
            : 'wordToNumber';

    const numberChoices =
        createNumberChoices(number);

    if (questionType === 'numberToWord') {
        return {
            type: questionType,
            display: number,
            correctAnswer:
                numberToWords(number),
            answers: shuffle(
                numberChoices.map((choice) =>
                    numberToWords(choice)
                )
            ),
        };
    }

    return {
        type: questionType,
        display: numberToWords(number),
        correctAnswer: number,
        answers: shuffle(numberChoices),
    };
}

export default function NumberRecognitionExercise({
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
                    📚
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
                        ? 'Perfect! You are a number-word expert!'
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

    const isNumberToWord =
        question.type === 'numberToWord';

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
                    Number Recognition
                </Text>

                <Text style={styles.instruction}>
                    Which{' '}
                    <Text
                        style={
                            styles.highlightedPrompt
                        }
                    >
                        {isNumberToWord
                            ? 'word'
                            : 'number'}
                    </Text>{' '}
                    matches this{' '}
                    {isNumberToWord
                        ? 'number'
                        : 'word'}
                    ?
                </Text>

                <View style={styles.questionCard}>
                    <View
                        style={[
                            styles.displayTile,
                            !isNumberToWord &&
                            styles.wordTile,
                        ]}
                    >
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.65}
                            style={
                                isNumberToWord
                                    ? styles.numberDisplay
                                    : styles.wordDisplay
                            }
                        >
                            {question.display}
                        </Text>
                    </View>

                    <Text
                        style={styles.questionHint}
                    >
                        Match the number and word
                    </Text>
                </View>

                <Text style={styles.chooseText}>
                    Choose your answer
                </Text>

                <View style={styles.answerList}>
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
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                        minimumFontScale={0.75}
                                        style={styles.answerText}
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
                            The correct answer is{' '}
                            {question.correctAnswer}.
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
        backgroundColor: '#EFF7FF',
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
        borderColor: '#A9CBE8',
        borderRadius: 18,
        borderWidth: 2,
        elevation: 3,
        paddingHorizontal: 15,
        paddingVertical: 9,
        shadowColor: '#255B89',
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
        color: '#255B89',
        fontSize: 15,
        fontWeight: '700',
    },

    questionNumber: {
        color: '#54718A',
        fontSize: 15,
        fontWeight: '700',
    },

    progressBackground: {
        backgroundColor: '#D7E6F4',
        borderRadius: 10,
        height: 10,
        marginBottom: 28,
        marginTop: 18,
        overflow: 'hidden',
    },

    progressFill: {
        backgroundColor: '#4A90D9',
        borderRadius: 10,
        height: '100%',
    },

    title: {
        color: '#20394F',
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
    },

    instruction: {
        color: '#54718A',
        fontSize: 18,
        lineHeight: 29,
        marginTop: 10,
        textAlign: 'center',
    },

    highlightedPrompt: {
        color: '#1671BD',
        fontSize: 20,
        fontWeight: '900',
        textShadowColor: '#B9DFFF',
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        textShadowRadius: 3,
        textTransform: 'uppercase',
    },

    questionCard: {
        alignItems: 'center',
        backgroundColor: '#F9FCFF',
        borderColor: '#B7D7F2',
        borderRadius: 24,
        borderWidth: 2,
        elevation: 4,
        justifyContent: 'center',
        marginTop: 26,
        minHeight: 210,
        padding: 24,
        shadowColor: '#255B89',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },

    displayTile: {
        alignItems: 'center',
        backgroundColor: '#EFF7FF',
        borderBottomWidth: 5,
        borderColor: '#78AEDA',
        borderRadius: 19,
        borderWidth: 3,
        elevation: 4,
        justifyContent: 'center',
        minHeight: 90,
        minWidth: 110,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#255B89',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 4,
    },

    wordTile: {
        minHeight: 110,
        width: '100%',
    },

    numberDisplay: {
        color: '#255B89',
        fontSize: 52,
        fontWeight: '900',
        textAlign: 'center',
    },

    wordDisplay: {
        color: '#255B89',
        fontSize: 36,
        fontWeight: '900',
        textAlign: 'center',
        textTransform: 'capitalize',
    },

    questionHint: {
        color: '#6D8295',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 18,
    },

    chooseText: {
        color: '#20394F',
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 15,
        marginTop: 28,
        textAlign: 'center',
    },

    answerList: {
        gap: 12,
    },

    answerButton: {
        alignItems: 'center',
        backgroundColor: '#F9FCFF',
        borderBottomWidth: 7,
        borderColor: '#8DBBE2',
        borderRadius: 20,
        borderWidth: 3,
        elevation: 5,
        justifyContent: 'center',
        minHeight: 68,
        padding: 12,
        shadowColor: '#255B89',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4,
    },

    answerButtonPressed: {
        opacity: 0.9,
        transform: [
            {
                translateY: 4,
            },
            {
                scale: 0.99,
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
        color: '#20394F',
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        textTransform: 'capitalize',
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
        color: '#20394F',
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },

    feedbackText: {
        color: '#54718A',
        fontSize: 15,
        lineHeight: 22,
        marginTop: 4,
        textAlign: 'center',
    },

    mainButton: {
        alignItems: 'center',
        backgroundColor: '#4A90D9',
        borderBottomWidth: 5,
        borderColor: '#2B68A0',
        borderRadius: 20,
        borderWidth: 2,
        elevation: 5,
        marginTop: 22,
        padding: 16,
        shadowColor: '#255B89',
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
        color: '#255B89',
        fontSize: 16,
        fontWeight: '800',
    },

    resultScreen: {
        alignItems: 'center',
        backgroundColor: '#EFF7FF',
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },

    resultEmoji: {
        fontSize: 80,
    },

    resultTitle: {
        color: '#20394F',
        fontSize: 30,
        fontWeight: '900',
        marginTop: 20,
        textAlign: 'center',
    },

    resultScore: {
        color: '#255B89',
        fontSize: 21,
        fontWeight: '800',
        marginTop: 14,
        textAlign: 'center',
    },

    resultMessage: {
        color: '#54718A',
        fontSize: 17,
        lineHeight: 25,
        marginTop: 10,
        textAlign: 'center',
    },
});