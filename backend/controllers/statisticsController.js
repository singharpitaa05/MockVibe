// STATISTICS CONTROLLER

import InterviewSession from '../models/InterviewSession.js';

// @desc    Get user statistics and analytics
// @route   GET /api/statistics/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all completed interviews for the user
    const completedInterviews = await InterviewSession.find({
      user: userId,
      status: 'completed',
    }).sort({ createdAt: -1 });

    // Calculate total interviews
    const totalInterviews = completedInterviews.length;

    // Calculate average score
    let averageScore = 0;
    if (totalInterviews > 0) {
      const totalScore = completedInterviews.reduce(
        (sum, session) => sum + (session.overallScore || 0),
        0
      );
      averageScore = (totalScore / totalInterviews).toFixed(1);
    }

    // Calculate total practice time (in hours)
    const totalPracticeTime = completedInterviews.reduce(
      (sum, session) => sum + (session.duration || 0),
      0
    );
    const totalHours = (totalPracticeTime / 3600).toFixed(1);

    // Get interview count by type
    const interviewsByType = completedInterviews.reduce((acc, session) => {
      acc[session.interviewType] = (acc[session.interviewType] || 0) + 1;
      return acc;
    }, {});

    // Get interview count by difficulty
    const interviewsByDifficulty = completedInterviews.reduce((acc, session) => {
      acc[session.difficulty] = (acc[session.difficulty] || 0) + 1;
      return acc;
    }, {});

    // Get recent performance trend (last 10 interviews)
    const recentInterviews = completedInterviews.slice(0, 10).reverse();
    const performanceTrend = recentInterviews.map((session, index) => ({
      sessionNumber: index + 1,
      score: session.overallScore || 0,
      date: session.createdAt,
    }));

    // Identify weak areas (categories with lower average scores)
    const weakAreas = [];
    if (completedInterviews.length > 0) {
      const typeScores = {};
      completedInterviews.forEach((session) => {
        if (!typeScores[session.interviewType]) {
          typeScores[session.interviewType] = { total: 0, count: 0 };
        }
        typeScores[session.interviewType].total += session.overallScore || 0;
        typeScores[session.interviewType].count += 1;
      });

      Object.keys(typeScores).forEach((type) => {
        const avg = typeScores[type].total / typeScores[type].count;
        if (avg < 60) {
          weakAreas.push({
            area: type,
            averageScore: avg.toFixed(1),
          });
        }
      });
    }

    // Calculate improvement rate (compare first 5 vs last 5 interviews)
    let improvementRate = 0;
    if (totalInterviews >= 10) {
      const firstFive = completedInterviews.slice(-5);
      const lastFive = completedInterviews.slice(0, 5);
      
      const firstFiveAvg = firstFive.reduce((sum, s) => sum + (s.overallScore || 0), 0) / 5;
      const lastFiveAvg = lastFive.reduce((sum, s) => sum + (s.overallScore || 0), 0) / 5;
      
      improvementRate = ((lastFiveAvg - firstFiveAvg) / firstFiveAvg * 100).toFixed(1);
    }

    res.json({
      totalInterviews,
      averageScore: parseFloat(averageScore),
      totalPracticeTime: parseFloat(totalHours),
      interviewsByType,
      interviewsByDifficulty,
      performanceTrend,
      weakAreas,
      improvementRate: parseFloat(improvementRate),
      recentInterviews: completedInterviews.slice(0, 5).map((session) => ({
        _id: session._id,
        jobRole: session.jobRole,
        interviewType: session.interviewType,
        score: session.overallScore,
        date: session.createdAt,
        duration: session.duration,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get detailed analytics
// @route   GET /api/statistics/analytics
// @access  Private
const getDetailedAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const completedInterviews = await InterviewSession.find({
      user: userId,
      status: 'completed',
    }).sort({ createdAt: -1 });

    // Calculate skill-wise performance
    const skillPerformance = {};
    completedInterviews.forEach((session) => {
      if (session.analysis && session.analysis.contentAnalysis) {
        const { contentAnalysis } = session.analysis;
        
        ['relevance', 'completeness', 'correctness', 'technicalAccuracy'].forEach((skill) => {
          if (!skillPerformance[skill]) {
            skillPerformance[skill] = { total: 0, count: 0 };
          }
          if (contentAnalysis[skill]) {
            skillPerformance[skill].total += contentAnalysis[skill];
            skillPerformance[skill].count += 1;
          }
        });
      }
    });

    const skillAverages = {};
    Object.keys(skillPerformance).forEach((skill) => {
      skillAverages[skill] = (
        skillPerformance[skill].total / skillPerformance[skill].count
      ).toFixed(1);
    });

    // Most common strengths and weaknesses
    const allStrengths = completedInterviews.flatMap((s) => s.strengths || []);
    const allWeaknesses = completedInterviews.flatMap((s) => s.weaknesses || []);

    const strengthCounts = allStrengths.reduce((acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {});

    const weaknessCounts = allWeaknesses.reduce((acc, weakness) => {
      acc[weakness] = (acc[weakness] || 0) + 1;
      return acc;
    }, {});

    const topStrengths = Object.entries(strengthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([strength, count]) => ({ strength, count }));

    const topWeaknesses = Object.entries(weaknessCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([weakness, count]) => ({ weakness, count }));

    res.json({
      skillAverages,
      topStrengths,
      topWeaknesses,
      totalQuestionsAnswered: completedInterviews.reduce(
        (sum, s) => sum + (s.questions?.length || 0),
        0
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getDashboardStats, getDetailedAnalytics };
