require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const Award = require('./models/Award');
const { analyzeChance, analyzeMultipleAwards } = require('./services/aiAnalysis');
const { generateEssayGuide } = require('./services/essayGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Matching algorithm
function matchStudentToAwards(studentData, awards) {
    const matches = [];

    for (const award of awards) {
        const matchResult = evaluateMatch(studentData, award);
        // Only include awards that are applicable (matchScore > 0)
        if (matchResult.matchScore > 0) {
            matches.push(matchResult);
        }
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
}

function evaluateMatch(studentData, award) {
    const matchReasons = [];
    const missingRequirements = [];
    let matchScore = 100;
    const criteria = award.eligibility;

    // ===== CRITICAL FILTERS: If student doesn't meet these, award is NOT APPLICABLE =====

    // Check University (CRITICAL - Must Match)
    if (studentData.university && award.university) {
        if (studentData.university !== award.university) {
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
    }

    // Check affiliations FIRST (CRITICAL - if required and not checked, skip this award entirely)
    if (criteria.affiliation) {
        const hasAffiliation = studentData.affiliations && studentData.affiliations[criteria.affiliation];

        if (!hasAffiliation) {
            // Student doesn't have this affiliation, so this award is NOT APPLICABLE
            // Return matchScore = 0 immediately (award won't be shown)
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }

        // Student HAS the affiliation
        matchReasons.push(`✓ Matches required affiliation: ${formatAffiliationName(criteria.affiliation)}`);
        matchScore += 25;
    }

    // Check Indigenous status (CRITICAL if required)
    if (criteria.indigenousOnly) {
        if (!studentData.indigenousStatus) {
            // Student is not Indigenous, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push('✓ Meets Indigenous student requirement');
        matchScore += 20;
    }

    // Check disability status (CRITICAL if required)
    if (criteria.hasDisability !== undefined) {
        if (studentData.hasDisability !== criteria.hasDisability) {
            // Student doesn't meet disability requirement, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push('✓ Meets disability requirement');
        matchScore += 15;
    }

    // Check former youth in care (CRITICAL if required)
    if (criteria.formerYouthInCare) {
        if (!studentData.formerYouthInCare) {
            // Student is not former youth in care, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push('✓ Meets former youth in care requirement');
        matchScore += 30;
    }

    // Check school district (CRITICAL if specified)
    if (criteria.schoolDistrict) {
        if (studentData.schoolDistrict !== criteria.schoolDistrict) {
            // Student is not from the required school district, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push(`✓ From required school district (#${criteria.schoolDistrict})`);
        matchScore += 20;
    }

    // Check citizenship status (CRITICAL - must match)
    if (criteria.citizenshipRequired && criteria.citizenshipRequired.length > 0) {
        if (!criteria.citizenshipRequired.includes(studentData.citizenshipStatus)) {
            // Wrong citizenship status, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push('✓ Meets citizenship requirement');
    }

    // Check campus (CRITICAL - must match)
    if (criteria.campus && criteria.campus.length > 0) {
        if (!criteria.campus.includes(studentData.campus)) {
            // Wrong campus, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push(`✓ Available for ${studentData.campus} campus`);
    }

    // Check student loan requirement (CRITICAL)
    if (criteria.studentLoanRequired) {
        if (!studentData.hasStudentLoan) {
            // Student doesn't have loan, award is NOT APPLICABLE
            return { award, matchScore: 0, matchReasons: [], missingRequirements: [] };
        }
        matchReasons.push('✓ Has required student loan');
    }

    // ===== MATCHING CRITERIA: These reduce score but don't eliminate the award =====

    // Check year
    if (criteria.requiredYear && criteria.requiredYear.length > 0) {
        if (criteria.requiredYear.includes(parseInt(studentData.year))) {
            matchReasons.push(`✓ Open to year ${studentData.year} students`);
        } else {
            missingRequirements.push(`Requires year: ${criteria.requiredYear.join(' or ')}`);
            matchScore -= 50;
        }
    } else {
        matchReasons.push('✓ Open to students of all years');
    }

    // Check faculty
    if (criteria.requiredFaculty && criteria.requiredFaculty.length > 0 && studentData.faculty) {
        if (criteria.requiredFaculty.some(f =>
            f.toLowerCase() === studentData.faculty.toLowerCase()
        )) {
            matchReasons.push(`✓ Matches your faculty (${studentData.faculty})`);
        } else {
            missingRequirements.push(`Requires faculty: ${criteria.requiredFaculty.join(' or ')}`);
            matchScore -= 40;
        }
    } else {
        matchReasons.push('✓ Open to students from all faculties');
    }

    // Check GPA
    if (criteria.minGPA) {
        if (studentData.gpa >= criteria.minGPA) {
            matchReasons.push(`✓ Meets minimum GPA requirement (${criteria.minGPA})`);
        } else {
            missingRequirements.push(`Requires minimum GPA of ${criteria.minGPA}`);
            matchScore -= 30;
        }
    }

    // Check gender
    if (criteria.gender && criteria.gender.length > 0) {
        if (studentData.gender && criteria.gender.includes(studentData.gender)) {
            matchReasons.push(`✓ Matches gender requirement`);
        } else {
            missingRequirements.push(`Requires gender: ${criteria.gender.join(' or ')}`);
            matchScore -= 25;
        }
    }

    // Check financial need
    if (criteria.financialNeed) {
        if (studentData.hasFinancialNeed) {
            matchReasons.push('✓ Matches financial need requirement');
        } else {
            missingRequirements.push('Requires demonstrated financial need');
            matchScore -= 30;
        }
    }

    // Check part-time eligibility
    if (criteria.partTimeEligible !== undefined && studentData.partTimeStudent) {
        if (criteria.partTimeEligible) {
            matchReasons.push('✓ Eligible as part-time student');
        } else {
            missingRequirements.push('Requires full-time enrollment');
            matchScore -= 40;
        }
    }

    // Ensure score doesn't go below 0
    matchScore = Math.max(0, matchScore);

    return {
        award,
        matchScore,
        matchReasons,
        missingRequirements,
    };
}

// Helper function to format affiliation names for display
function formatAffiliationName(affiliation) {
    const affiliationNames = {
        alphaGammaDelta: 'Alpha Gamma Delta member',
        canadianArmedForces: 'Canadian Armed Forces affiliation',
        chineseAncestry: 'Chinese ancestry',
        swedishHeritage: 'Swedish heritage',
        iranianHeritage: 'Persian/Iranian heritage',
        ilwu: 'ILWU member or family',
        ufcw: 'UFCW Local 1518 member or family',
        beemCreditUnion: 'Beem Credit Union member or family',
        sikhCommunity: 'Sikh community member',
        pipingIndustry: 'Piping Industry/UA Local 170 family',
        royalCanadianLegion: 'Royal Canadian Legion affiliation',
        knightsPythias: 'Knights Pythias affiliation',
        canforEmployees: 'Canadian Forest Products employee family',
        uaPlumbersSteamfitters: 'UA Plumbers & Steamfitters Local 170 family',
        ilwuLocal517: 'ILWU Local 517 member'
    };

    return affiliationNames[affiliation] || affiliation;
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'UBC Financial Aid API is running' });
});

// Get all awards
app.get('/api/awards', async (req, res) => {
    try {
        const awards = await Award.find({});
        res.json(awards);
    } catch (error) {
        console.error('Error fetching awards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Match student to awards
app.post('/api/match', async (req, res) => {
    try {
        const studentData = req.body;

        // Validate required fields
        if (!studentData.university || !studentData.campus || !studentData.citizenshipStatus || !studentData.faculty || !studentData.year) {
            return res.status(400).json({
                error: 'Missing required fields!'
            });
        }

        const awards = await Award.find({});
        const matches = matchStudentToAwards(studentData, awards);

        // Categorize matches
        const categorized = {
            perfect: matches.filter(m => m.matchScore >= 90 && m.missingRequirements.length === 0),
            good: matches.filter(m => m.matchScore >= 60 && m.matchScore < 90),
            partial: matches.filter(m => m.matchScore > 0 && m.matchScore < 60),
        };

        res.json({
            totalMatches: matches.length,
            matches,
            categorized,
            studentData
        });
    } catch (error) {
        console.error('Error matching student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analyze chance for a single award
app.post('/api/analyze-chance', async (req, res) => {
    try {
        const { studentData, awardId } = req.body;

        if (!studentData || !awardId) {
            return res.status(400).json({
                error: 'Missing required fields: studentData and awardId are required'
            });
        }

        // Find the award
        const award = await Award.findOne({ id: awardId });
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }

        const analysis = await analyzeChance(studentData, award);
        res.json({
            awardId: award.id,
            awardName: award.name,
            ...analysis
        });
    } catch (error) {
        console.error('Error analyzing chance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analyze chances for multiple awards (top matches)
app.post('/api/analyze-chances', async (req, res) => {
    try {
        const { studentData, awardIds, limit = 5 } = req.body;

        if (!studentData) {
            return res.status(400).json({
                error: 'Missing required field: studentData'
            });
        }

        // Get awards to analyze (either specific IDs or use top matches)
        let awardsToAnalyze;
        if (awardIds && awardIds.length > 0) {
            awardsToAnalyze = await Award.find({ id: { $in: awardIds } });
        } else {
            // Get top matches first
            const awards = await Award.find({});
            const matches = matchStudentToAwards(studentData, awards);
            awardsToAnalyze = matches.slice(0, limit).map(m => m.award);
        }

        const analyses = await analyzeMultipleAwards(studentData, awardsToAnalyze, limit);
        res.json({
            totalAnalyzed: analyses.length,
            analyses
        });
    } catch (error) {
        console.error('Error analyzing chances:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Generate Essay Guide
app.post('/api/generate-essay', async (req, res) => {
    try {
        const { studentData, awardId } = req.body;

        if (!studentData || !awardId) {
            return res.status(400).json({
                error: 'Missing required fields: studentData and awardId are required'
            });
        }

        // Find the award
        const award = await Award.findOne({ id: awardId });
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }

        const essayGuide = await generateEssayGuide(studentData, award);
        res.json(essayGuide);
    } catch (error) {
        console.error('Error generating essay guide:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Subscribe to award notifications
app.post('/api/awards/:id/subscribe', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const award = await Award.findOne({ id });
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }

        // Check if already subscribed
        const isSubscribed = award.notificationSubscribers.some(sub => sub.email === email);
        if (isSubscribed) {
            return res.status(400).json({ error: 'Already subscribed to this award' });
        }

        award.notificationSubscribers.push({ email });
        await award.save();

        res.json({ message: 'Successfully subscribed to award notifications' });
    } catch (error) {
        console.error('Error subscribing to award:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
    try {
        const totalAwards = await Award.countDocuments();
        const totalFunding = await Award.aggregate([
            {
                $project: {
                    numericAmount: {
                        $cond: {
                            if: { $isNumber: "$amount" },
                            then: "$amount",
                            else: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$numericAmount" }
                }
            }
        ]);

        const fundingAmount = totalFunding.length > 0 ? totalFunding[0].total : 0;

        // This is a placeholder for total subscribers since I didn't verify the structure fully,
        // but assuming we want total distinct subscribers across all awards or total subscriptions.
        // Let's go with total subscriptions.
        const totalSubscriptionsResult = await Award.aggregate([
            { $unwind: "$notificationSubscribers" },
            { $count: "count" }
        ]);
        const totalSubscriptions = totalSubscriptionsResult.length > 0 ? totalSubscriptionsResult[0].count : 0;

        res.json({
            totalAwards,
            totalFunding: fundingAmount,
            totalSubscriptions
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`Gemini AI: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Using fallback (no API key)'}`);
});

module.exports = app;