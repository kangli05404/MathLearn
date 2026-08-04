import {
  useEffect,
  useRef,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CountingExercise from './screens/CountingExercise';
import PlaceValueExercise from './screens/PlaceValueExercise';
import NumberRecognitionExercise from './screens/NumberRecognitionExercise';
import NumberSequenceExercise from './screens/NumberSequenceExercise';

// Unique AsyncStorage key used to save the learner's daily-goal record.
const DAILY_GOAL_KEY =
  '@mathlearn_daily_goal';

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    today.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

//Central configuration for the four learning activities.
const topics = [
  {
    id: 1,
    title: 'Count Objects',
    description:
      'Count and choose the correct number',
    image: require('./assets/countObject.png'),
    colors: ['#FFD45A', '#FF981A'],
    borderColor: '#D97000',
    iconBackground: '#FFF1B8',
  },
  {
    id: 2,
    title: 'Place Value',
    description:
      'Learn about tens and ones',
    image: require('./assets/placeValue.png'),
    colors: ['#7EDB80', '#36A852'],
    borderColor: '#237C38',
    iconBackground: '#DDF7DE',
  },
  {
    id: 3,
    title: 'Number Words',
    description:
      'Match numbers with English words',
    image: require('./assets/numberWords.avif'),
    colors: ['#65CCFF', '#168CD8'],
    borderColor: '#0967A8',
    iconBackground: '#DDF5FF',
  },
  {
    id: 4,
    title: 'Number Sequence',
    description:
      'Arrange numbers in the correct order',
    image: require('./assets/numberSequence.png'),
    colors: ['#C17CFF', '#8546D4'],
    borderColor: '#5E2AAB',
    iconBackground: '#F0DDFF',
  },
];

// Reusable card for selecting an exercise
function TopicCard({ topic, onOpen }) {
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`Start ${topic.title}`}
      style={({ pressed }) => [
        styles.topicButton,
        {
          backgroundColor:
            topic.borderColor,
          borderColor:
            topic.borderColor,
        },
        pressed &&
        styles.topicButtonPressed,
      ]}
    >
      <LinearGradient
        colors={topic.colors}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 0,
          y: 1,
        }}
        style={styles.topicGradient}
      >
        <View style={styles.buttonGloss} />

        <View
          style={[
            styles.topicIconContainer,
            topic.image &&
            styles.topicImageContainer,
            {
              backgroundColor:
                topic.iconBackground,
            },
          ]}
        >
          {topic.image ? (
            <Image
              source={topic.image}
              style={styles.topicImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.topicIcon}>
              {topic.icon}
            </Text>
          )}
        </View>

        <View
          style={styles.topicTextContainer}
        >
          <Text
            style={styles.topicTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {topic.title}
          </Text>

          <Text
            style={styles.topicDescription}
            numberOfLines={2}
          >
            {topic.description}
          </Text>
        </View>

        <View style={styles.startPill}>
          <Text style={styles.startPillText}>
            Start
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState('home');

  const [
    dailyGoalCompleted,
    setDailyGoalCompleted,
  ] = useState(false);

  const [
    dailyGoalLoaded,
    setDailyGoalLoaded,
  ] = useState(false);

  const mascotPosition = useRef(
    new Animated.Value(0)
  ).current;

  const trophyScale = useRef(
    new Animated.Value(1)
  ).current;

  /*
   * Mascot animation
   */

  useEffect(() => {
    if (currentScreen !== 'home') {
      mascotPosition.stopAnimation();
      mascotPosition.setValue(0);
      return;
    }

    const mascotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotPosition, {
          toValue: -7,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(mascotPosition, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    mascotAnimation.start();

    return () => {
      mascotAnimation.stop();
    };
  }, [currentScreen, mascotPosition]);

  /*
   * Load the daily goal.
   *
   * It checks once when the app starts
   * and once every minute for a new day.
   */

  useEffect(() => {
    let stillMounted = true;

    async function loadDailyGoal() {
      try {
        const savedValue =
          await AsyncStorage.getItem(
            DAILY_GOAL_KEY
          );

        const savedGoal = savedValue
          ? JSON.parse(savedValue)
          : null;

        const today = getTodayDate();

        const completedToday =
          savedGoal?.date === today &&
          savedGoal?.completed === true;

        if (stillMounted) {
          setDailyGoalCompleted(
            completedToday
          );

          setDailyGoalLoaded(true);
        }

        if (savedGoal?.date !== today) {
          await AsyncStorage.setItem(DAILY_GOAL_KEY, JSON.stringify({
            date: today,
            completed: false,
          })
          );
        }
      } catch (error) {
        console.log(
          'Unable to load daily goal:',
          error
        );

        if (stillMounted) {
          setDailyGoalCompleted(false);
          setDailyGoalLoaded(true);
        }
      }
    }

    loadDailyGoal();

    const dailyGoalTimer = setInterval(
      loadDailyGoal,
      60000
    );

    return () => {
      stillMounted = false;
      clearInterval(dailyGoalTimer);
    };
  }, []);

  /*
   * Trophy celebration
   */

  useEffect(() => {
    if (!dailyGoalCompleted) {
      trophyScale.setValue(1);
      return;
    }

    const trophyAnimation =
      Animated.sequence([
        Animated.timing(trophyScale, {
          toValue: 1.25,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(trophyScale, {
          toValue: 0.9,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(trophyScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]);

    trophyAnimation.start();

    return () => {
      trophyAnimation.stop();
    };
  }, [
    dailyGoalCompleted,
    trophyScale,
  ]);

  /*
   * Mark today's goal as completed
   */

  async function completeDailyGoal() {
    setDailyGoalCompleted(true);
    setDailyGoalLoaded(true);

    try {
      await AsyncStorage.setItem(
        DAILY_GOAL_KEY,
        JSON.stringify({
          date: getTodayDate(),
          completed: true,
        })
      );
    } catch (error) {
      console.log(
        'Unable to save daily goal:',
        error
      );
    }
  }

  function returnHome() {
    setCurrentScreen('home');
  }

  function openTopic(topic) {
    if (topic.id === 1) {
      setCurrentScreen('counting');
    } else if (topic.id === 2) {
      setCurrentScreen('placeValue');
    } else if (topic.id === 3) {
      setCurrentScreen('numberRecognition');
    } else if (topic.id === 4) {
      setCurrentScreen('numberSequence');
    }
  }

  /*
   * Exercise screens
   */

  if (currentScreen === 'counting') {
    return (
      <CountingExercise
        onBack={returnHome}
        onComplete={completeDailyGoal}
      />
    );
  }

  if (currentScreen === 'placeValue') {
    return (
      <PlaceValueExercise
        onBack={returnHome}
        onComplete={completeDailyGoal}
      />
    );
  }

  if (
    currentScreen ===
    'numberRecognition'
  ) {
    return (
      <NumberRecognitionExercise
        onBack={returnHome}
        onComplete={completeDailyGoal}
      />
    );
  }

  if (
    currentScreen === 'numberSequence'
  ) {
    return (
      <NumberSequenceExercise
        onBack={returnHome}
        onComplete={completeDailyGoal}
      />
    );
  }

  /*
   * Homepage
   */

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require('./assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StatusBar style="light" />

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.page
          }
        >
          {/* Welcome card */}
          <View style={styles.welcomeCard}>
            <View
              style={styles.greetingBadge}
            >
              <Text
                style={styles.greetingEmoji}
              >
                👋
              </Text>

              <Text
                style={styles.greeting}
              >
                HELLO, YOUNG LEARNER!
              </Text>
            </View>

            <View
              style={styles.brandSection}
            >
              <View style={styles.brandRow}>
                <Text
                  style={styles.mathTitle}
                >
                  Math
                </Text>

                <Text
                  style={styles.learnTitle}
                >
                  Learn
                </Text>
              </View>

              <Animated.Image
                source={require('./assets/cartoon.png')}
                resizeMode="contain"
                style={[
                  styles.cartoon,
                  {
                    transform: [
                      {
                        translateY:
                          mascotPosition,
                      },
                    ],
                  },
                ]}
              />
            </View>

            <Text style={styles.subtitle}>
              Choose a topic and begin your{' '}
              <Text
                style={
                  styles.adventureText
                }
              >
                math adventure!
              </Text>
            </Text>
          </View>

          {/* Daily goal card */}
          <View
            style={[
              styles.dailyGoalCard,
              dailyGoalCompleted &&
              styles.dailyGoalCardCompleted,
            ]}
          >
            <Animated.View
              style={[
                styles.dailyGoalIconBox,
                dailyGoalCompleted &&
                styles.dailyGoalIconBoxCompleted,
                {
                  transform: [
                    {
                      scale: trophyScale,
                    },
                  ],
                },
              ]}
            >
              <Text
                style={[
                  styles.dailyGoalIcon,
                  !dailyGoalCompleted &&
                  styles.dailyGoalIconIncomplete,
                ]}
              >
                🏆
              </Text>
            </Animated.View>

            <View
              style={
                styles.dailyGoalContent
              }
            >
              <Text
                style={styles.dailyGoalLabel}
              >
                TODAY&apos;S GOAL
              </Text>

              <Text
                style={styles.dailyGoalTitle}
              >
                {dailyGoalCompleted
                  ? 'Goal completed!'
                  : 'Complete one math activity'}
              </Text>

              <View
                style={
                  styles.dailyGoalProgress
                }
              >
                <View
                  style={[
                    styles.dailyGoalProgressFill,
                    {
                      width:
                        dailyGoalCompleted
                          ? '100%'
                          : '0%',
                    },
                  ]}
                />
              </View>

              <Text
                style={
                  styles.dailyGoalStatus
                }
              >
                {!dailyGoalLoaded
                  ? 'Checking today’s progress...'
                  : dailyGoalCompleted
                    ? '1 of 1 activity completed'
                    : '0 of 1 activity completed'}
              </Text>
            </View>

            <View
              style={[
                styles.dailyGoalBadge,
                dailyGoalCompleted &&
                styles.dailyGoalBadgeCompleted,
              ]}
            >
              <Text
                style={[
                  styles.dailyGoalBadgeText,
                  dailyGoalCompleted &&
                  styles.dailyGoalBadgeTextCompleted,
                ]}
              >
                {dailyGoalCompleted
                  ? '✓'
                  : '0/1'}
              </Text>
            </View>
          </View>

          <Text
            style={styles.sectionTitle}
          >
            Choose a Topic
          </Text>

          <View style={styles.topicList}>
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onOpen={() =>
                  openTopic(topic)
                }
              />
            ))}
          </View>

          <Text style={styles.footer}>
            Learn, practice and have fun!
          </Text>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF8E7',
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
  },

  page: {
    paddingBottom: 45,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  /*
   * Welcome card
   */

  welcomeCard: {
    backgroundColor:
      'rgba(255, 255, 255, 0.92)',
    borderBottomColor: '#B7DFF2',
    borderBottomWidth: 6,
    borderColor:
      'rgba(255, 255, 255, 0.98)',
    borderRadius: 22,
    borderWidth: 2,
    elevation: 6,
    marginBottom: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#244E66',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  greetingBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E7F6FF',
    borderColor: '#B7DFF2',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  greetingEmoji: {
    fontSize: 18,
    marginRight: 7,
  },

  greeting: {
    color: '#26739B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  brandSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
  },

  mathTitle: {
    color: '#F28A2E',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: '#FFD7A8',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 2,
  },

  learnTitle: {
    color: '#168CD8',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: '#BDE7FF',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 2,
  },

  cartoon: {
    height: 90,
    marginLeft: 2,
    marginRight: -5,
    width: 90,
  },

  subtitle: {
    color: '#3E596D',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 2,
  },

  adventureText: {
    color: '#8546D4',
    fontWeight: '900',
  },

  /*
   * Daily goal card
   */

  dailyGoalCard: {
    alignItems: 'center',
    backgroundColor: '#F3E1C7',
    borderBottomWidth: 7,
    borderColor: '#B9895B',
    borderRadius: 22,
    borderWidth: 2,
    elevation: 6,
    flexDirection: 'row',
    marginBottom: 28,
    padding: 16,
    shadowColor: '#6E4B2F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  dailyGoalCardCompleted: {
    backgroundColor: '#FFF2B8',
    borderColor: '#D3A72C',
  },

  dailyGoalIconBox: {
    alignItems: 'center',
    backgroundColor: '#E8C9A4',
    borderColor: '#B9895B',
    borderRadius: 18,
    borderWidth: 2,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },

  dailyGoalIconBoxCompleted: {
    backgroundColor: '#FFD765',
    borderColor: '#D3A72C',
  },

  dailyGoalIcon: {
    fontSize: 31,
  },

  dailyGoalIconIncomplete: {
    opacity: 0.35,
  },

  dailyGoalContent: {
    flex: 1,
    marginHorizontal: 13,
  },

  dailyGoalLabel: {
    color: '#8A5A35',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  dailyGoalTitle: {
    color: '#563C29',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
    marginTop: 3,
  },

  dailyGoalProgress: {
    backgroundColor: '#D8B992',
    borderRadius: 10,
    height: 8,
    marginTop: 9,
    overflow: 'hidden',
  },

  dailyGoalProgressFill: {
    backgroundColor: '#55A868',
    borderRadius: 10,
    height: '100%',
  },

  dailyGoalStatus: {
    color: '#81634A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },

  dailyGoalBadge: {
    alignItems: 'center',
    backgroundColor: '#E4C5A1',
    borderRadius: 15,
    justifyContent: 'center',
    minWidth: 43,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },

  dailyGoalBadgeCompleted: {
    backgroundColor: '#55A868',
  },

  dailyGoalBadgeText: {
    color: '#795437',
    fontSize: 13,
    fontWeight: '900',
  },

  dailyGoalBadgeTextCompleted: {
    color: '#FFFFFF',
    fontSize: 18,
  },

  /*
   * Topic cards
   */

  sectionTitle: {
    color: '#302A24',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },

  topicList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },

  topicButton: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 8,
    borderRadius: 28,
    borderWidth: 3,
    elevation: 7,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: '48%',
  },

  topicButtonPressed: {
    opacity: 0.92,
    transform: [
      {
        translateY: 4,
      },
      {
        scale: 0.99,
      },
    ],
  },

  topicGradient: {
    alignItems: 'center',
    borderRadius: 23,
    minHeight: 220,
    overflow: 'hidden',
    padding: 14,
  },

  buttonGloss: {
    backgroundColor:
      'rgba(255, 255, 255, 0.25)',
    borderRadius: 15,
    height: 18,
    left: 10,
    position: 'absolute',
    right: 10,
    top: 5,
  },

  topicIconContainer: {
    alignItems: 'center',
    borderColor:
      'rgba(255, 255, 255, 0.8)',
    borderRadius: 19,
    borderWidth: 2,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },

  topicImageContainer: {
    borderRadius: 18,
    height: 75,
    overflow: 'hidden',
    width: '100%',
  },

  topicImage: {
    height: '100%',
    width: '100%',
  },

  topicIcon: {
    fontSize: 34,
  },

  topicTextContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },

  topicTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor:
      'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 2,
  },

  topicDescription: {
    color:
      'rgba(255, 255, 255, 0.95)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
    textShadowColor:
      'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
  },

  startPill: {
    alignItems: 'center',
    backgroundColor:
      'rgba(255, 255, 255, 0.3)',
    borderColor:
      'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 38,
    paddingHorizontal: 22,
    paddingVertical: 8,
  },

  startPillText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textShadowColor:
      'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 1,
  },

  footer: {
    color: '#756D64',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 30,
    textAlign: 'center',
  },
});