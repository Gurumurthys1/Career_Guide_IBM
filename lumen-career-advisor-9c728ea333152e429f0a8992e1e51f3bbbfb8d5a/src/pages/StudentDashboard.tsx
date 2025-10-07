import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Trophy, TrendingUp, BarChart3, Target, GraduationCap, ArrowLeft, RefreshCw } from 'lucide-react';

// Mock quiz data
const quizData = {
  Physics: [
    { id: 1, question: "What is the SI unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], correct: "Newton" },
    { id: 2, question: "What is the speed of light in vacuum?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁹ m/s"], correct: "3 × 10⁸ m/s" },
    { id: 3, question: "Which law states that energy cannot be created or destroyed?", options: ["Newton's First Law", "Law of Conservation of Energy", "Ohm's Law", "Boyle's Law"], correct: "Law of Conservation of Energy" },
    { id: 4, question: "What is the acceleration due to gravity on Earth?", options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "11 m/s²"], correct: "9.8 m/s²" },
    { id: 5, question: "What type of energy does a moving object possess?", options: ["Potential Energy", "Kinetic Energy", "Thermal Energy", "Chemical Energy"], correct: "Kinetic Energy" },
  ],
  Chemistry: [
    { id: 1, question: "What is the atomic number of Carbon?", options: ["6", "12", "14", "8"], correct: "6" },
    { id: 2, question: "What is the pH of pure water?", options: ["7", "0", "14", "1"], correct: "7" },
    { id: 3, question: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], correct: "Nitrogen" },
    { id: 4, question: "What is the chemical formula for water?", options: ["H₂O", "CO₂", "NaCl", "CH₄"], correct: "H₂O" },
    { id: 5, question: "What is the process of converting solid to gas called?", options: ["Evaporation", "Sublimation", "Condensation", "Melting"], correct: "Sublimation" },
  ],
  Biology: [
    { id: 1, question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"], correct: "Mitochondria" },
    { id: 2, question: "How many chromosomes do humans have?", options: ["46", "23", "48", "44"], correct: "46" },
    { id: 3, question: "What is the process by which plants make food?", options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"], correct: "Photosynthesis" },
    { id: 4, question: "Which blood type is the universal donor?", options: ["O-", "A+", "B-", "AB+"], correct: "O-" },
    { id: 5, question: "What is DNA short for?", options: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Dynamic Nuclear Acid", "Dual Nucleic Acid"], correct: "Deoxyribonucleic Acid" },
  ],
  Mathematics: [
    { id: 1, question: "What is the value of π (pi) approximately?", options: ["3.14159", "2.71828", "1.41421", "1.61803"], correct: "3.14159" },
    { id: 2, question: "What is the derivative of x²?", options: ["2x", "x", "2x²", "x²/2"], correct: "2x" },
    { id: 3, question: "What is the sum of angles in a triangle?", options: ["180°", "360°", "90°", "270°"], correct: "180°" },
    { id: 4, question: "What is the square root of 144?", options: ["12", "14", "10", "16"], correct: "12" },
    { id: 5, question: "What is 15% of 200?", options: ["30", "25", "35", "20"], correct: "30" },
  ],
  "Computer Science": [
    { id: 1, question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language"], correct: "HyperText Markup Language" },
    { id: 2, question: "Which data structure uses LIFO principle?", options: ["Stack", "Queue", "Array", "Tree"], correct: "Stack" },
    { id: 3, question: "What is the time complexity of binary search?", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], correct: "O(log n)" },
    { id: 4, question: "Which programming language is known for AI/ML?", options: ["Python", "C++", "Java", "Ruby"], correct: "Python" },
    { id: 5, question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correct: "Central Processing Unit" },
  ]
};

const degreePrograms = {
  Physics: [
    { title: "Aerospace Engineering", description: "Design and develop aircraft, spacecraft, and satellites", colleges: ["IIT Bombay", "IIT Madras", "MIT", "Stanford"], domains: ["Aviation", "Space Technology", "Defense"] },
    { title: "Mechanical Engineering", description: "Work with machines, energy systems, and manufacturing", colleges: ["IIT Delhi", "NIT Trichy", "Georgia Tech"], domains: ["Manufacturing", "Automotive", "Robotics"] },
    { title: "Physics Research", description: "Pure physics research in quantum mechanics, astrophysics", colleges: ["TIFR", "IISc Bangalore", "Caltech"], domains: ["Research", "Academia", "Labs"] }
  ],
  Chemistry: [
    { title: "Chemical Engineering", description: "Design processes for chemical production and manufacturing", colleges: ["IIT Kanpur", "ICT Mumbai", "UC Berkeley"], domains: ["Pharmaceuticals", "Petrochemicals", "Materials"] },
    { title: "Pharmaceutical Sciences", description: "Drug development and medicinal chemistry", colleges: ["NIPER", "Manipal", "Oxford"], domains: ["Healthcare", "Drug R&D", "Biotech"] },
    { title: "Environmental Science", description: "Study environmental chemistry and sustainability", colleges: ["IIT Kharagpur", "JNU", "ETH Zurich"], domains: ["Sustainability", "Conservation", "Green Tech"] }
  ],
  Biology: [
    { title: "Biotechnology", description: "Apply biological systems to technology and industry", colleges: ["IIT Roorkee", "Anna University", "Cambridge"], domains: ["Biotech", "Genetic Engineering", "Healthcare"] },
    { title: "Medical Sciences (MBBS)", description: "Become a doctor and practice medicine", colleges: ["AIIMS", "CMC Vellore", "Johns Hopkins"], domains: ["Healthcare", "Surgery", "Research"] },
    { title: "Zoology/Botany", description: "Study animals and plants, work in conservation", colleges: ["DU", "BHU", "Oxford"], domains: ["Wildlife", "Conservation", "Research"] }
  ],
  Mathematics: [
    { title: "Data Science & Analytics", description: "Analyze data and build predictive models", colleges: ["IIT Madras", "ISI Kolkata", "Carnegie Mellon"], domains: ["Tech", "Finance", "Research"] },
    { title: "Actuarial Science", description: "Risk assessment and financial modeling", colleges: ["University of Mumbai", "LSE", "Wharton"], domains: ["Insurance", "Finance", "Consulting"] },
    { title: "Pure Mathematics", description: "Research in mathematical theory and applications", colleges: ["IISc", "TIFR", "Princeton"], domains: ["Academia", "Research", "Cryptography"] }
  ],
  "Computer Science": [
    { title: "Computer Science & Engineering", description: "Software development, algorithms, and systems", colleges: ["IIT Bombay", "BITS Pilani", "Stanford"], domains: ["Software", "AI/ML", "Cybersecurity"] },
    { title: "Artificial Intelligence & Machine Learning", description: "Build intelligent systems and ML models", colleges: ["IIT Hyderabad", "CMI", "MIT"], domains: ["AI", "Data Science", "Robotics"] },
    { title: "Information Technology", description: "IT infrastructure, networks, and web development", colleges: ["VIT", "Manipal", "Georgia Tech"], domains: ["IT Services", "Web Dev", "Cloud Computing"] }
  ]
};

const StudentDashboard = () => {
  const [page, setPage] = useState('home'); // home, quiz, results, recommendations
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizHistory, setQuizHistory] = useState([]);

  const subjects = Object.keys(quizData);

  const startQuiz = (subject) => {
    setSelectedSubject(subject);
    setQuestions(quizData[subject]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setPage('quiz');
  };

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({ ...answers, [currentQuestion.id]: answer });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz({ ...answers, [currentQuestion.id]: answer });
    }
  };

  const submitQuiz = (finalAnswers) => {
    let correct = 0;
    questions.forEach(q => {
      if (finalAnswers[q.id] === q.correct) {
        correct++;
      }
    });

    const result = {
      subject: selectedSubject,
      score: correct,
      total: questions.length,
      percentage: (correct / questions.length) * 100,
      timestamp: new Date().toISOString()
    };

    setQuizHistory([...quizHistory, result]);
    setPage('results');
  };

  const calculateOverallStats = () => {
    if (quizHistory.length === 0) return { avgScore: 0, totalQuizzes: 0 };
    
    const avgScore = quizHistory.reduce((sum, q) => sum + q.percentage, 0) / quizHistory.length;
    return { avgScore: avgScore.toFixed(1), totalQuizzes: quizHistory.length };
  };

  const getSubjectScores = () => {
    const scores = {};
    subjects.forEach(subject => {
      const subjectQuizzes = quizHistory.filter(q => q.subject === subject);
      if (subjectQuizzes.length > 0) {
        scores[subject] = subjectQuizzes.reduce((sum, q) => sum + q.percentage, 0) / subjectQuizzes.length;
      } else {
        scores[subject] = 0;
      }
    });
    return scores;
  };

  // PAGE 1: HOME - SUBJECT SELECTOR
  if (page === 'home') {
    const stats = calculateOverallStats();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎓 Student Dashboard</h1>
            <p className="text-gray-600">Select a subject to start your assessment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Quizzes Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">{stats.totalQuizzes}</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">{stats.avgScore}%</p>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={stats.avgScore} className="mt-2" />
                <p className="text-sm text-gray-600 mt-2">Keep improving!</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Subject Quizzes</CardTitle>
              <CardDescription>Choose a subject to begin your assessment</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <Button
                  key={subject}
                  variant="outline"
                  className="h-32 flex flex-col gap-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all"
                  onClick={() => startQuiz(subject)}
                >
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span className="font-semibold text-lg">{subject}</span>
                  <span className="text-xs text-gray-500">5 Questions</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {quizHistory.length > 0 && (
            <Card className="border-2 mt-6">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setPage('results')}
                >
                  View Detailed Results & Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // PAGE 2: QUIZ PAGE
  if (page === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setPage('home')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-base px-4 py-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-32" />
                  <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                </div>
              </div>
              <CardTitle className="text-2xl">{selectedSubject} Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2">
                <p className="text-xl font-semibold text-gray-800">{currentQuestion?.question}</p>
              </div>

              <div className="space-y-3 pt-4">
                {currentQuestion?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-6 text-left hover:bg-blue-50 hover:border-blue-300 transition-all"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="font-bold text-lg mr-4 text-blue-600">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-base">{option}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // PAGE 3: RESULTS VISUALIZATION
  if (page === 'results') {
    const latestResult = quizHistory[quizHistory.length - 1];
    const subjectScores = getSubjectScores();
    const maxScore = Math.max(...Object.values(subjectScores), 1);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setPage('home')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="border-2 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-3xl text-center">🎉 Quiz Complete!</CardTitle>
              <CardDescription className="text-center text-lg">{latestResult.subject} Assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-white block">
                      {latestResult.score}/{latestResult.total}
                    </span>
                    <span className="text-white text-sm">Correct</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2">{latestResult.percentage.toFixed(1)}% Score</p>
                <Progress value={latestResult.percentage} className="mt-4 h-3" />
              </div>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {latestResult.percentage >= 80 ? (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-green-700">🌟 Excellent Performance!</p>
                      <p className="text-gray-700">You demonstrate strong understanding of {latestResult.subject}. You're ready for advanced programs!</p>
                    </div>
                  ) : latestResult.percentage >= 60 ? (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-blue-700">👍 Good Progress!</p>
                      <p className="text-gray-700">You're on the right track in {latestResult.subject}. Keep building your skills!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-orange-700">📚 Keep Learning!</p>
                      <p className="text-gray-700">Focus on strengthening your fundamentals in {latestResult.subject}.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Subject Comparison
              </CardTitle>
              <CardDescription>Your performance across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map(subject => {
                  const score = subjectScores[subject];
                  const barWidth = (score / maxScore) * 100;
                  
                  return (
                    <div key={subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{subject}</span>
                        <span className="text-sm font-semibold text-gray-600">
                          {score > 0 ? `${score.toFixed(1)}%` : 'Not taken'}
                        </span>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 flex items-center justify-end px-3"
                          style={{ width: `${barWidth}%` }}
                        >
                          {score > 0 && <span className="text-white text-xs font-semibold">{score.toFixed(0)}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => startQuiz(latestResult.subject)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake {latestResult.subject} Quiz
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => setPage('recommendations')}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              View Degree Recommendations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // PAGE 4: DEGREE RECOMMENDATIONS
  if (page === 'recommendations') {
    const subjectScores = getSubjectScores();
    const topSubjects = Object.entries(subjectScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setPage('results')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎓 Recommended Degree Programs</h1>
            <p className="text-gray-600 text-lg">Based on your quiz performance and strengths</p>
          </div>

          {topSubjects.length === 0 ? (
            <Card className="border-2">
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">Take some quizzes to get personalized recommendations!</p>
                <Button onClick={() => setPage('home')}>Start Quiz</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {topSubjects.map(([subject, score]) => (
                <div key={subject}>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="text-base px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
                      {subject} - {score.toFixed(0)}% Score
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {degreePrograms[subject]?.map((program, idx) => (
                      <Card key={idx} className="border-2 hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-xl">{program.title}</CardTitle>
                          <CardDescription className="text-base">{program.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="font-semibold text-sm text-gray-700 mb-2">🏛️ Top Colleges:</p>
                            <div className="flex flex-wrap gap-2">
                              {program.colleges.slice(0, 3).map((college, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {college}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-sm text-gray-700 mb-2">💼 Career Domains:</p>
                            <div className="flex flex-wrap gap-2">
                              {program.domains.map((domain, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {domain}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => setPage('home')}
            >
              Take More Quizzes
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => setPage('results')}
            >
              View Results Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentDashboard;