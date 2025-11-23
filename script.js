// import api config
import { RAPIDAPI_KEY, API_URL, API_HOST } from './api-config.js';

// storing app data
const appState = {
    currentStep: 1,
    selectedSymptoms: [],
    healthProfile: {},
    lifestyle: {},
    insights: null
};

// common symptoms list - made simple for rwanda context
const symptoms = [
    // fever and common sickness
    'Fever', 'Headache', 'Body pain', 'Joint pain', 'Back pain',
    // stomach issues
    'Stomach pain', 'Diarrhea', 'Nausea', 'Vomiting', 'Loss of appetite',
    // breathing
    'Cough', 'Running nose', 'Sore throat', 'Chest pain',
    // tiredness
    'Feeling tired', 'Weakness', 'Dizziness',
    // skin
    'Skin rash', 'Itching', 'Chills', 'Sweating',
    // other common ones
    'Difficulty sleeping', 'Stress', 'Muscle pain', 'Cold'
];

// start app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderSymptoms();
    setupEventListeners();
    updateProgressIndicator();
}

// show symptoms on screen
function renderSymptoms() {
    const symptomGrid = document.getElementById('symptomGrid');
    symptomGrid.innerHTML = ''; // clear first
    
    symptoms.forEach(symptom => {
        const symptomItem = document.createElement('div');
        symptomItem.className = 'symptom-item';
        symptomItem.textContent = symptom;
        symptomItem.dataset.symptom = symptom;
        
        // mark as selected if already chosen
        if (appState.selectedSymptoms.includes(symptom)) {
            symptomItem.classList.add('selected');
        }
        
        symptomItem.addEventListener('click', () => toggleSymptom(symptom));
        symptomGrid.appendChild(symptomItem);
    });
    
    updateSelectedSymptomsDisplay();
}

// add or remove symptom when clicked
function toggleSymptom(symptom) {
    const index = appState.selectedSymptoms.indexOf(symptom);
    
    if (index > -1) {
        appState.selectedSymptoms.splice(index, 1); // remove
    } else {
        appState.selectedSymptoms.push(symptom); // add
    }
    
    renderSymptoms(); // refresh display
}

// show selected symptoms at bottom
function updateSelectedSymptomsDisplay() {
    const selectedTags = document.getElementById('selectedTags');
    selectedTags.innerHTML = '';
    
    if (appState.selectedSymptoms.length === 0) {
        selectedTags.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">No symptoms selected</p>';
        return;
    }
    
    appState.selectedSymptoms.forEach(symptom => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${symptom}</span>
            <span class="tag-remove" onclick="removeSymptom('${symptom}')">×</span>
        `;
        selectedTags.appendChild(tag);
    });
}

function removeSymptom(symptom) {
    const index = appState.selectedSymptoms.indexOf(symptom);
    if (index > -1) {
        appState.selectedSymptoms.splice(index, 1);
        renderSymptoms();
    }
}

// setup click handlers and stuff
function setupEventListeners() {
    const symptomSearch = document.getElementById('symptomSearch');
    if (symptomSearch) {
        symptomSearch.addEventListener('input', filterSymptoms);
    }
    
    // for tags on step 2
    setupTagInput('medicalHistory', 'medicalHistoryTags');
    setupTagInput('medications', 'medicationTags');
    setupTagInput('allergies', 'allergyTags');
    
    // stress slider update
    const stressLevel = document.getElementById('stressLevel');
    if (stressLevel) {
        stressLevel.addEventListener('input', (e) => {
            document.getElementById('stressValue').textContent = e.target.value;
        });
    }
}

// search filter
function filterSymptoms(e) {
    const searchTerm = e.target.value.toLowerCase();
    const symptomItems = document.querySelectorAll('.symptom-item');
    
    symptomItems.forEach(item => {
        const symptom = item.dataset.symptom.toLowerCase();
        if (symptom.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none'; // hide if not matching
        }
    });
}

// handle tag input on step 2
function setupTagInput(inputId, containerId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    
    if (!input || !container) return;
    
    let tags = [];
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = input.value.trim();
            if (value && !tags.includes(value)) {
                tags.push(value);
                updateTagDisplay(container, tags, inputId);
                input.value = '';
            }
        }
    });
    
    // add on blur too
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (value && !tags.includes(value)) {
            tags.push(value);
            updateTagDisplay(container, tags, inputId);
            input.value = '';
        }
    });
}

// show tags below input
function updateTagDisplay(container, tags, inputId) {
    container.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span>${tag}</span>
            <span class="tag-remove" onclick="removeTag('${inputId}', '${tag}')">×</span>
        `;
        container.appendChild(tagElement);
    });
    
    // save to state
    if (inputId === 'medicalHistory') {
        appState.healthProfile.medicalHistory = tags;
    } else if (inputId === 'medications') {
        appState.healthProfile.medications = tags;
    } else if (inputId === 'allergies') {
        appState.healthProfile.allergies = tags;
    }
}

function removeTag(inputId, tagToRemove) {
    const container = document.getElementById(inputId === 'medicalHistory' ? 'medicalHistoryTags' : 
                                                 inputId === 'medications' ? 'medicationTags' : 'allergyTags');
    const tags = Array.from(container.querySelectorAll('.tag-item span:first-child'))
        .map(span => span.textContent)
        .filter(tag => tag !== tagToRemove);
    
    if (inputId === 'medicalHistory') {
        appState.healthProfile.medicalHistory = tags;
    } else if (inputId === 'medications') {
        appState.healthProfile.medications = tags;
    } else if (inputId === 'allergies') {
        appState.healthProfile.allergies = tags;
    }
    
    updateTagDisplay(container, tags, inputId);
}

// navigation
function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        if (appState.currentStep < 4) {
            appState.currentStep++;
            showStep(appState.currentStep);
            updateProgressIndicator();
        }
    }
}

function prevStep() {
    if (appState.currentStep > 1) {
        appState.currentStep--;
        showStep(appState.currentStep);
        updateProgressIndicator();
    }
}

function showStep(stepNumber) {
    // hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // show selected step
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
}

// check if form is valid
function validateCurrentStep() {
    if (appState.currentStep === 1) {
        if (appState.selectedSymptoms.length === 0) {
            alert('Please select at least one symptom to continue.');
            return false;
        }
        return true;
    } else if (appState.currentStep === 2) {
        const form = document.getElementById('healthProfileForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        return true;
    } else if (appState.currentStep === 3) {
        const form = document.getElementById('lifestyleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }
        return true;
    }
    return true;
}

// save form data to state
function saveCurrentStepData() {
    if (appState.currentStep === 2) {
        const form = document.getElementById('healthProfileForm');
        const formData = new FormData(form);
        
        appState.healthProfile = {
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            height: parseFloat(formData.get('height')),
            weight: parseFloat(formData.get('weight')),
            medicalHistory: appState.healthProfile.medicalHistory || [],
            medications: appState.healthProfile.medications || [],
            allergies: appState.healthProfile.allergies || []
        };
    } else if (appState.currentStep === 3) {
        const form = document.getElementById('lifestyleForm');
        const formData = new FormData(form);
        
        appState.lifestyle = {
            activityLevel: formData.get('activityLevel'),
            sleepHours: parseFloat(formData.get('sleepHours')),
            sleepQuality: formData.get('sleepQuality'),
            dietType: formData.get('dietType'),
            waterIntake: parseInt(formData.get('waterIntake')),
            stressLevel: parseInt(formData.get('stressLevel'))
        };
    }
}

// update progress bar at top
function updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < appState.currentStep) {
            step.classList.add('completed'); // done
        } else if (stepNumber === appState.currentStep) {
            step.classList.add('active'); // current
        }
    });
}

// get insights from api
async function generateInsights() {
    if (!validateCurrentStep()) {
        return;
    }
    
    saveCurrentStepData();
    
    // go to step 4
    appState.currentStep = 4;
    showStep(4);
    updateProgressIndicator();
    
    // show loading
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('insightsContent').style.display = 'none';
    
    // get all the data together
    const wellnessData = {
        symptoms: appState.selectedSymptoms,
        healthProfile: appState.healthProfile,
        lifestyle: appState.lifestyle
    };
    
    try {
        // call api
        const insights = await callAIWellnessAPI(wellnessData);
        
        appState.insights = insights;
        
        // show results
        displayInsights(insights);
        
    } catch (error) {
        // if api fails use fallback
        const fallbackInsights = generateFallbackInsights(wellnessData);
        displayInsights(fallbackInsights);
    } finally {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('insightsContent').style.display = 'block';
    }
}

// call rapidapi for medical diagnosis
async function callAIWellnessAPI(data) {
    const { symptoms, healthProfile, lifestyle } = data;
    
    // map activity to what api wants
    const activityMapping = {
        'sedentary': 'none',
        'light': 'light',
        'moderate': 'moderate',
        'active': 'active',
        'very-active': 'very active'
    };
    
    // diet mapping
    const dietMapping = {
        'omnivore': 'balanced',
        'vegetarian': 'vegetarian',
        'vegan': 'vegan',
        'keto': 'keto',
        'paleo': 'paleo',
        'mediterranean': 'mediterranean',
        'other': 'balanced'
    };
    
    // get alcohol (we dont have this field so using stress)
    const getAlcoholConsumption = () => {
        if (lifestyle.stressLevel >= 7) return 'occasional';
        if (lifestyle.stressLevel >= 4) return 'moderate';
        return 'occasional';
    };
    
    // fix gender format
    const normalizeGender = (gender) => {
        if (!gender || gender === 'prefer-not-to-say') return 'female';
        return gender.toLowerCase();
    };
    
    // make sure symptoms not empty
    const normalizedSymptoms = symptoms.length > 0 ? symptoms : ['general wellness check'];
    
    // build the request data
    const apiData = JSON.stringify({
        symptoms: normalizedSymptoms,
        patientInfo: {
            age: healthProfile.age || 35,
            gender: normalizeGender(healthProfile.gender),
            height: healthProfile.height || 170,
            weight: healthProfile.weight || 70,
            medicalHistory: healthProfile.medicalHistory || [],
            currentMedications: healthProfile.medications || [],
            allergies: healthProfile.allergies || [],
            lifestyle: {
                smoking: false,
                alcohol: getAlcoholConsumption(),
                exercise: activityMapping[lifestyle.activityLevel] || 'moderate',
                diet: dietMapping[lifestyle.dietType] || 'balanced'
            }
        },
        lang: 'en'
    });
    
    try {
        // using fetch instead of xhr to avoid CORS issues
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': API_HOST,
                'Content-Type': 'application/json'
            },
            body: apiData // already JSON.stringify() above
        };
        
        const response = await fetch(API_URL, options);
        
        // check status code
        if (!response.ok) {
            // get error details
            let errorMessage = `API request failed with status ${response.status}`;
            
            if (response.status === 403) {
                errorMessage += ' (Forbidden) - Possible reasons: Invalid API key, expired subscription, or insufficient permissions';
            } else if (response.status === 401) {
                errorMessage += ' (Unauthorized) - Invalid or missing API key';
            } else if (response.status === 429) {
                errorMessage += ' (Too Many Requests) - Rate limit exceeded, try again later';
            } else if (response.status === 400) {
                errorMessage += ' (Bad Request) - Invalid request data format';
            } else if (response.status === 500) {
                errorMessage += ' (Internal Server Error) - Server error, try again later';
            } else if (response.status === 503) {
                errorMessage += ' (Service Unavailable) - API temporarily unavailable';
            }
            
            // try to get error response body
            try {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage += ` - Details: ${errorText.substring(0, 200)}`;
                }
            } catch (e) {
                // ignore if can't read error body
            }
            
            console.log('API request: failed');
            throw new Error(errorMessage);
        }
        
        // response is ok, parse it
        const result = await response.text();
        
        // parse JSON response
        let responseData;
        try {
            responseData = JSON.parse(result);
            console.log('API request: success');
        } catch (parseError) {
            console.log('API request: failed');
            console.error('Failed to parse JSON response');
            throw new Error('Failed to parse API response as JSON');
        }
        
        // convert api response to our format
        const parsedInsights = parseRapidAPIResponse(responseData, data);
        return parsedInsights;
        
    } catch (error) {
        // handle network errors or other failures
        if (error.message && error.message.includes('API request failed')) {
            console.log('API request: failed');
            throw error;
        } else {
            console.log('API request: failed');
            throw new Error(`Failed to call API: ${error.message || 'Network error occurred'}`);
        }
    }
}

// parse what api returns
function parseRapidAPIResponse(apiResponse, originalData) {
    const patterns = [];
    const recommendations = [];
    const medicalAdvice = [];
    const tips = [];
    
    try {
        // check actual api response structure: apiResponse.result.analysis
        if (apiResponse.result && apiResponse.result.analysis) {
            const analysis = apiResponse.result.analysis;
            
            // get possible conditions from analysis.possibleConditions
            if (analysis.possibleConditions && Array.isArray(analysis.possibleConditions)) {
                analysis.possibleConditions.forEach(condition => {
                    patterns.push({
                        type: condition.condition || 'Possible Condition',
                        description: condition.description || condition.additionalInfo || 'Condition identified',
                        severity: condition.riskLevel ? condition.riskLevel.toLowerCase() : 'moderate'
                    });
                });
            }
            
            // get recommendations from generalAdvice
            if (analysis.generalAdvice) {
                // recommendedActions
                if (analysis.generalAdvice.recommendedActions && Array.isArray(analysis.generalAdvice.recommendedActions)) {
                    analysis.generalAdvice.recommendedActions.forEach(action => {
                        recommendations.push({
                            category: 'Health Action',
                            suggestion: action
                        });
                    });
                }
                
                // lifestyleConsiderations
                if (analysis.generalAdvice.lifestyleConsiderations && Array.isArray(analysis.generalAdvice.lifestyleConsiderations)) {
                    analysis.generalAdvice.lifestyleConsiderations.forEach(consideration => {
                        recommendations.push({
                            category: 'Lifestyle',
                            suggestion: consideration
                        });
                    });
                }
                
                // whenToSeekMedicalAttention
                if (analysis.generalAdvice.whenToSeekMedicalAttention && Array.isArray(analysis.generalAdvice.whenToSeekMedicalAttention)) {
                    analysis.generalAdvice.whenToSeekMedicalAttention.forEach(advice => {
                        medicalAdvice.push({
                            situation: 'When to Seek Medical Attention',
                            advice: advice
                        });
                    });
                }
            }
            
            // get tips from educationalResources
            if (apiResponse.result.educationalResources) {
                if (apiResponse.result.educationalResources.preventiveMeasures && Array.isArray(apiResponse.result.educationalResources.preventiveMeasures)) {
                    apiResponse.result.educationalResources.preventiveMeasures.forEach(measure => {
                        tips.push(measure);
                    });
                }
            }
        }
        
        // fallback: check old format if new one doesn't exist
        if (apiResponse.result && !apiResponse.result.analysis) {
            const result = apiResponse.result;
            if (result.possibleConditions) {
                result.possibleConditions.forEach(condition => {
                    patterns.push({
                        type: condition.condition || condition.name || 'Possible Condition',
                        description: condition.description || condition.info || 'Condition identified',
                        severity: condition.riskLevel || condition.severity || 'moderate'
                    });
                });
            }
            
            if (result.recommendations) {
                result.recommendations.forEach(rec => {
                    recommendations.push({
                        category: 'Health',
                        suggestion: typeof rec === 'string' ? rec : (rec.text || rec)
                    });
                });
            }
        }
        
        // check top-level fields as fallback
        if (apiResponse.diagnosis) {
            if (Array.isArray(apiResponse.diagnosis)) {
                apiResponse.diagnosis.forEach((diag, index) => {
                    patterns.push({
                        type: diag.condition || `Diagnosis ${index + 1}`,
                        description: diag.description || diag.explanation || 'Diagnosis information provided',
                        severity: diag.severity || 'moderate'
                    });
                });
            } else if (typeof apiResponse.diagnosis === 'object') {
                patterns.push({
                    type: apiResponse.diagnosis.condition || 'Medical Assessment',
                    description: apiResponse.diagnosis.description || apiResponse.diagnosis.explanation || 'Medical diagnosis provided',
                    severity: apiResponse.diagnosis.severity || 'moderate'
                });
            }
        }
        
        if (apiResponse.recommendations && Array.isArray(apiResponse.recommendations)) {
            apiResponse.recommendations.forEach(rec => {
                recommendations.push({
                    category: rec.category || 'Medical',
                    suggestion: rec.text || rec.advice || rec
                });
            });
        }
        
        if (apiResponse.medicalAdvice) {
            const adviceList = Array.isArray(apiResponse.medicalAdvice) ? apiResponse.medicalAdvice : [apiResponse.medicalAdvice];
            adviceList.forEach(advice => {
                medicalAdvice.push({
                    situation: 'Medical Consultation Recommended',
                    advice: typeof advice === 'string' ? advice : (advice.text || advice.message || 'Consult with a healthcare professional')
                });
            });
        }
        
        // Add general wellness tips based on lifestyle data
        if (originalData.lifestyle) {
            const { lifestyle, healthProfile } = originalData;
            
            // Sleep recommendations
            if (lifestyle.sleepHours < 7) {
                tips.push(`Aim for 7-9 hours of quality sleep per night. You're currently getting ${lifestyle.sleepHours} hours.`);
            }
            
            // Hydration tips
            if (lifestyle.waterIntake < 8) {
                tips.push(`Increase your daily water intake. You're currently drinking ${lifestyle.waterIntake} glasses - aim for at least 8 glasses per day.`);
            }
            
            // Exercise tips
            if (lifestyle.activityLevel === 'sedentary') {
                tips.push('Incorporate light physical activity into your daily routine, such as a 15-minute walk.');
            }
            
            // Stress management
            if (lifestyle.stressLevel >= 7) {
                tips.push('Practice stress-reduction techniques like deep breathing or meditation to manage your stress levels.');
            }
        }
        
        // If no patterns were extracted, add a general one
        if (patterns.length === 0) {
            patterns.push({
                type: 'Medical Analysis Completed',
                description: 'Your symptoms and health information have been analyzed. Review the recommendations below.',
                severity: 'moderate'
            });
        }
        
        // Add default medical advice if none provided
        if (medicalAdvice.length === 0) {
            medicalAdvice.push({
                situation: 'General Medical Consultation',
                advice: 'If symptoms persist or worsen, or if you have any concerns about your health, please consult with a qualified healthcare professional.'
            });
        }
        
        // Add general wellness tips if none were added
        if (tips.length === 0) {
            tips.push('Maintain a balanced diet with plenty of fruits and vegetables');
            tips.push('Stay hydrated throughout the day');
            tips.push('Get regular exercise appropriate for your fitness level');
            tips.push('Prioritize quality sleep and establish a consistent sleep schedule');
            tips.push('Listen to your body and rest when needed');
        }
        
        return {
            patterns,
            recommendations,
            medicalAdvice,
            tips
        };
        
    } catch (error) {
        // Return fallback structure if parsing fails
        return generateFallbackInsights(originalData);
    }
}

// old prompt function - not used anymore but leaving it
function generateWellnessPrompt(data) {
    const { symptoms, healthProfile, lifestyle } = data;
    
    let prompt = `Analyze the following wellness information and provide insights:\n\n`;
    
    prompt += `Symptoms: ${symptoms.join(', ')}\n\n`;
    prompt += `Health Profile:\n`;
    prompt += `- Age: ${healthProfile.age}\n`;
    prompt += `- Gender: ${healthProfile.gender}\n`;
    prompt += `- Height: ${healthProfile.height} cm\n`;
    prompt += `- Weight: ${healthProfile.weight} kg\n`;
    
    if (healthProfile.medicalHistory?.length > 0) {
        prompt += `- Medical History: ${healthProfile.medicalHistory.join(', ')}\n`;
    }
    if (healthProfile.medications?.length > 0) {
        prompt += `- Medications: ${healthProfile.medications.join(', ')}\n`;
    }
    if (healthProfile.allergies?.length > 0) {
        prompt += `- Allergies: ${healthProfile.allergies.join(', ')}\n`;
    }
    
    prompt += `\nLifestyle:\n`;
    prompt += `- Activity Level: ${lifestyle.activityLevel}\n`;
    prompt += `- Sleep: ${lifestyle.sleepHours} hours per night, Quality: ${lifestyle.sleepQuality}\n`;
    prompt += `- Diet: ${lifestyle.dietType}\n`;
    prompt += `- Water Intake: ${lifestyle.waterIntake} glasses per day\n`;
    prompt += `- Stress Level: ${lifestyle.stressLevel}/10\n\n`;
    
    prompt += `Provide:\n`;
    prompt += `1. Identified wellness patterns (stress, fatigue, dehydration, lifestyle imbalance, etc.)\n`;
    prompt += `2. Personalized lifestyle recommendations\n`;
    prompt += `3. Situations where a healthcare professional should be consulted\n`;
    prompt += `4. General wellness tips\n`;
    prompt += `Format the response as JSON with keys: patterns, recommendations, medicalAdvice, tips`;
    
    return prompt;
}

// old parse function - not used
function parseAIResponse(responseText) {
    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('Failed to parse AI response as JSON:', e);
    }
    
    // fallback
    return {
        patterns: [{ type: 'General', description: 'Wellness analysis completed' }],
        recommendations: [{ category: 'General', suggestion: 'Maintain a balanced lifestyle' }],
        medicalAdvice: [{ situation: 'If symptoms persist or worsen, consult a healthcare professional' }],
        tips: ['Stay hydrated', 'Get adequate sleep', 'Maintain regular exercise']
    };
}

// fallback if api fails - basic rules
function generateFallbackInsights(data) {
    const { symptoms, healthProfile, lifestyle } = data;
    const patterns = [];
    const recommendations = [];
    const medicalAdvice = [];
    const tips = [];
    
    // Analyze symptoms
    const fatigueSymptoms = symptoms.filter(s => 
        ['fatigue', 'low energy', 'tiredness', 'exhaustion', 'weakness', 'lethargy'].some(
            term => s.toLowerCase().includes(term)
        )
    );
    
    const painSymptoms = symptoms.filter(s => 
        ['headache', 'pain', 'ache'].some(term => s.toLowerCase().includes(term))
    );
    
    const dizzinessSymptoms = symptoms.filter(s => 
        ['dizziness', 'vertigo', 'lightheadedness'].some(term => s.toLowerCase().includes(term))
    );
    
    // Identify patterns
    if (fatigueSymptoms.length > 0) {
        patterns.push({
            type: 'Fatigue Pattern',
            description: 'You\'re experiencing fatigue-related symptoms. This may be related to sleep quality, stress levels, or lifestyle factors.',
            severity: 'moderate'
        });
    }
    
    if (lifestyle.sleepHours < 7) {
        patterns.push({
            type: 'Sleep Deprivation',
            description: `You're getting ${lifestyle.sleepHours} hours of sleep, which may be below recommended levels (7-9 hours for adults).`,
            severity: 'warning'
        });
        
        recommendations.push({
            category: 'Sleep',
            suggestion: 'Aim for 7-9 hours of quality sleep per night. Establish a consistent sleep schedule and create a relaxing bedtime routine.'
        });
    }
    
    if (lifestyle.waterIntake < 6) {
        patterns.push({
            type: 'Dehydration Risk',
            description: `You're drinking ${lifestyle.waterIntake} glasses of water per day, which may be insufficient.`,
            severity: 'moderate'
        });
        
        recommendations.push({
            category: 'Hydration',
            suggestion: 'Increase your daily water intake to at least 8 glasses (2 liters). Carry a water bottle with you as a reminder.'
        });
    }
    
    if (lifestyle.stressLevel >= 7) {
        patterns.push({
            type: 'High Stress',
            description: `Your stress level is ${lifestyle.stressLevel}/10, which is quite high. High stress can impact overall wellness.`,
            severity: 'warning'
        });
        
        recommendations.push({
            category: 'Stress Management',
            suggestion: 'Practice stress-reduction techniques such as deep breathing, meditation, or gentle exercise. Consider talking to a counselor or therapist.'
        });
    }
    
    if (lifestyle.activityLevel === 'sedentary') {
        patterns.push({
            type: 'Low Activity',
            description: 'Your activity level is sedentary. Regular physical activity is important for overall wellness.',
            severity: 'moderate'
        });
        
        recommendations.push({
            category: 'Exercise',
            suggestion: 'Start with light activities like walking 10-15 minutes daily, gradually increasing duration and intensity.'
        });
    }
    
    // medical advice
    if (symptoms.length >= 5) {
        medicalAdvice.push({
            situation: 'Multiple symptoms present',
            advice: 'If you\'re experiencing multiple symptoms simultaneously, consider consulting a healthcare professional for a comprehensive evaluation.'
        });
    }
    
    if (painSymptoms.length > 0 && lifestyle.stressLevel >= 7) {
        medicalAdvice.push({
            situation: 'Persistent pain with high stress',
            advice: 'Chronic pain combined with high stress levels may benefit from professional medical evaluation and stress management support.'
        });
    }
    
    // tips
    tips.push('Maintain a balanced diet with plenty of fruits and vegetables');
    tips.push('Stay hydrated throughout the day');
    tips.push('Get regular exercise, even if it\'s just a short walk');
    tips.push('Prioritize quality sleep and establish a consistent sleep schedule');
    tips.push('Take breaks and practice stress management techniques');
    tips.push('Listen to your body and rest when needed');
    
    // bmi check
    if (healthProfile.height && healthProfile.weight) {
        const heightInMeters = healthProfile.height / 100;
        const bmi = healthProfile.weight / (heightInMeters * heightInMeters);
        
        if (bmi < 18.5) {
            recommendations.push({
                category: 'Nutrition',
                suggestion: 'Your BMI suggests you may be underweight. Consider consulting a nutritionist for personalized dietary guidance.'
            });
        } else if (bmi > 25) {
            recommendations.push({
                category: 'Nutrition',
                suggestion: 'Your BMI suggests you may benefit from weight management. Focus on balanced nutrition and regular physical activity.'
            });
        }
    }
    
    return {
        patterns,
        recommendations,
        medicalAdvice,
        tips
    };
}

// show all insights on page
function displayInsights(insights) {
    displaySummary(insights);
    displayPatterns(insights.patterns || []);
    displayRecommendations(insights.recommendations || []);
    displayMedicalAdvice(insights.medicalAdvice || []);
    displayTips(insights.tips || []);
}

// show summary section
function displaySummary(insights) {
    const container = document.getElementById('wellnessSummary');
    const { patterns, recommendations, medicalAdvice } = insights;
    
    const patternCount = patterns?.length || 0;
    const recCount = recommendations?.length || 0;
    const medicalCount = medicalAdvice?.length || 0;
    
    let summaryHTML = '<div class="summary-grid">';
    
    summaryHTML += `
        <div class="summary-card">
            <div class="summary-icon">🔍</div>
            <div class="summary-number">${patternCount}</div>
            <div class="summary-label">Pattern${patternCount !== 1 ? 's' : ''} Found</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon">💡</div>
            <div class="summary-number">${recCount}</div>
            <div class="summary-label">Recommendation${recCount !== 1 ? 's' : ''}</div>
        </div>
        <div class="summary-card">
            <div class="summary-icon">⚠️</div>
            <div class="summary-number">${medicalCount}</div>
            <div class="summary-label">Important Note${medicalCount !== 1 ? 's' : ''}</div>
        </div>
    `;
    
    summaryHTML += '</div>';
    
    // Add key findings
    if (patternCount > 0) {
        summaryHTML += '<div class="key-findings">';
        summaryHTML += '<h4>Key Findings:</h4><ul>';
        
        patterns.slice(0, 3).forEach(pattern => {
            summaryHTML += `<li>${pattern.type}: ${pattern.description.substring(0, 80)}${pattern.description.length > 80 ? '...' : ''}</li>`;
        });
        
        summaryHTML += '</ul></div>';
    }
    
    container.innerHTML = summaryHTML;
}

// show patterns
function displayPatterns(patterns) {
    const container = document.getElementById('wellnessPatterns');
    container.innerHTML = '';
    
    if (patterns.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>✅ No concerning patterns identified. Your wellness indicators look good!</p></div>';
        return;
    }
    
    patterns.forEach((pattern, index) => {
        const card = document.createElement('div');
        card.className = `pattern-card ${pattern.severity || 'moderate'}`;
        
        // Add icon based on severity
        let icon = '📊';
        if (pattern.severity === 'warning') icon = '⚠️';
        else if (pattern.severity === 'alert') icon = '🚨';
        
        card.innerHTML = `
            <div class="pattern-header">
                <span class="pattern-icon">${icon}</span>
                <h4>${pattern.type}</h4>
            </div>
            <div class="pattern-body">
                <p>${pattern.description}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// show recommendations
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>✅ Keep up the great work! Your current lifestyle habits are well-balanced.</p></div>';
        return;
    }
    
    // group by category
    const grouped = {};
    recommendations.forEach(rec => {
        if (!grouped[rec.category]) {
            grouped[rec.category] = [];
        }
        grouped[rec.category].push(rec);
    });
    
    Object.keys(grouped).forEach((category, catIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'recommendation-category';
        
        const categoryIcon = getCategoryIcon(category);
        categoryDiv.innerHTML = `
            <div class="category-header">
                <span class="category-icon">${categoryIcon}</span>
                <h4>${category}</h4>
            </div>
            <div class="category-recommendations">
        `;
        
        grouped[category].forEach((rec, index) => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <div class="rec-number">${index + 1}</div>
                <div class="rec-content">
                    <p class="rec-text">${rec.suggestion}</p>
                </div>
            `;
            categoryDiv.querySelector('.category-recommendations').appendChild(item);
        });
        
        categoryDiv.innerHTML += '</div>';
        container.appendChild(categoryDiv);
    });
}

// get icon
function getCategoryIcon(category) {
    const icons = {
        'Sleep': '😴',
        'Hydration': '💧',
        'Exercise': '🏃',
        'Stress Management': '🧘',
        'Nutrition': '🥗',
        'General': '💡',
        'Health Action': '💊',
        'Lifestyle': '🌱',
        'Treatment': '🏥',
        'Medical': '🔬',
        'Health': '❤️'
    };
    return icons[category] || '✅';
}

// show medical advice
function displayMedicalAdvice(adviceList) {
    const container = document.getElementById('medicalAdvice');
    container.innerHTML = '';
    
    if (adviceList.length === 0) {
        container.innerHTML = `
            <div class="medical-advice-item positive">
                <div class="medical-icon">✅</div>
                <div class="medical-content">
                    <strong>Continue Monitoring</strong>
                    <p>Your current symptoms and lifestyle factors don't indicate an immediate need for medical consultation. However, always consult a healthcare professional if you have any concerns or if symptoms persist or worsen.</p>
                </div>
            </div>
        `;
        return;
    }
    
    adviceList.forEach((advice, index) => {
        const item = document.createElement('div');
        item.className = 'medical-advice-item';
        item.innerHTML = `
            <div class="medical-icon">⚠️</div>
            <div class="medical-content">
                <strong>${advice.situation || 'Important Notice'}</strong>
                <p>${advice.advice || advice}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// show tips
function displayTips(tips) {
    const container = document.getElementById('wellnessTips');
    container.innerHTML = '';
    
    if (tips.length === 0) {
        return;
    }
    
    tips.forEach((tip, index) => {
        const item = document.createElement('div');
        item.className = 'tip-item';
        item.innerHTML = `
            <div class="tip-icon">✨</div>
            <div class="tip-content">
                <p>${tip}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// reset everything
function startOver() {
    if (confirm('Are you sure you want to start over? All your data will be cleared.')) {
        // Reset state
        appState.currentStep = 1;
        appState.selectedSymptoms = [];
        appState.healthProfile = {};
        appState.lifestyle = {};
        appState.insights = null;
        
        // Reset forms
        document.getElementById('healthProfileForm')?.reset();
        document.getElementById('lifestyleForm')?.reset();
        document.getElementById('symptomSearch').value = '';
        
        // Clear tag containers
        document.getElementById('medicalHistoryTags').innerHTML = '';
        document.getElementById('medicationTags').innerHTML = '';
        document.getElementById('allergyTags').innerHTML = '';
        
        // Reset stress slider
        const stressLevel = document.getElementById('stressLevel');
        if (stressLevel) {
            stressLevel.value = 5;
            document.getElementById('stressValue').textContent = '5';
        }
        
        // Show first step
        showStep(1);
        updateProgressIndicator();
        renderSymptoms();
    }
}

