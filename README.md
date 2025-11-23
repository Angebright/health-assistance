# MediAssist Wellness Companion

An interactive web application designed to help users better understand their daily well-being by analyzing reported symptoms, lifestyle habits, and personal health information.

## ⚠️ Important Disclaimer

**MediAssist does not diagnose medical conditions.** It provides general wellness suggestions only. Users should consult qualified healthcare professionals for medical concerns.

## Features

### 1. Guided Symptom & Wellness Input
- Symptoms grouped into intuitive categories (Fatigue, Headache, Dizziness, Body aches, Low energy)
- Searchable symptom database
- Visual feedback for selected symptoms
- Easy symptom selection and removal

### 2. Personal Health & Lifestyle Profile
- Collects basic demographic information (age, gender, height, weight)
- Allows users to add medical history tags
- Tracks medications and allergies
- Captures lifestyle elements including activity level, sleep patterns, and diet habits

### 3. AI-Powered Wellness Insights
- Uses an AI API to analyze provided information
- Identifies possible wellness patterns such as stress, fatigue, dehydration, or lifestyle imbalance
- Offers non-medical insights based on symptom-habit correlations

### 4. Personalized Lifestyle Recommendations
- Suggests habits to improve sleep, hydration, nutrition, and energy levels
- Provides reminders and general wellness tips
- Highlights situations where a medical professional should be consulted

### 5. Responsive, Accessible Interface
- Mobile-first user interface
- Step-by-step workflow with clear progress indicators
- Designed for easy use on all devices
- Accessibility features included

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling (with modern design, gradients, and animations)
- **JavaScript (ES6+)** - Functionality and interactivity
- **AI API Integration** - For wellness insights (OpenAI compatible)

## Getting Started

### Basic Setup

1. **Download/Clone** the project files
2. **Open** `index.html` in a web browser
3. **Start using** the application immediately!

No build process or server setup required - it's a pure frontend application.

### AI API Configuration (Optional)

To enable AI-powered insights:

1. Open `script.js`
2. Find the `callAIWellnessAPI` function (around line 300)
3. Replace `'YOUR_API_KEY_HERE'` with your OpenAI API key:
   ```javascript
   const API_KEY = 'your-actual-api-key-here';
   ```

**Note:** If no API key is configured, the application will automatically use intelligent rule-based fallback insights that analyze your data locally.

### Using the Application

1. **Step 1: Select Symptoms**
   - Browse or search for symptoms
   - Click to select/deselect symptoms
   - View selected symptoms at the bottom

2. **Step 2: Health Profile**
   - Fill in basic information (age, gender, height, weight)
   - Add medical history, medications, and allergies (press Enter or comma to add tags)

3. **Step 3: Lifestyle Information**
   - Select activity level
   - Enter sleep patterns and quality
   - Choose diet type and water intake
   - Set stress level using the slider

4. **Step 4: View Insights**
   - Click "Get Wellness Insights" to analyze your data
   - Review identified wellness patterns
   - Read personalized recommendations
   - Check when to consult healthcare professionals
   - Browse wellness tips

## File Structure

```
.
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Application logic and functionality
└── README.md       # This file
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features in Detail

### Symptom Selection
- 30+ common symptoms available
- Real-time search filtering
- Visual selection indicators
- Easy removal of selected symptoms

### Form Validation
- Required field validation
- Number range validation
- Form navigation with data persistence

### Progress Tracking
- Visual progress indicator
- Step completion tracking
- Clear navigation between steps

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface
- Optimized for tablets and desktops

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #50C878;
    --accent-color: #FF6B6B;
    /* ... */
}
```

### Adding Symptoms
Edit the `symptoms` array in `script.js`:
```javascript
const symptoms = [
    'Your Symptom 1',
    'Your Symptom 2',
    // ...
];
```

## Privacy & Security

- **All data processing happens locally** in your browser
- **No data is sent to external servers** unless you configure an AI API
- **No user data is stored** - everything is session-based
- **No cookies or tracking** used

## Support

For issues or questions:
1. Check that all files are in the same directory
2. Ensure JavaScript is enabled in your browser
3. Check browser console for any error messages

## License

This project is provided as-is for educational and personal use.

---

**Remember:** This tool provides general wellness guidance only. Always consult qualified healthcare professionals for medical concerns.





