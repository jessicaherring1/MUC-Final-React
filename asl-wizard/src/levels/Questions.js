// Questions.js

export const level1Questions = [
    {
        english: "Do you want more food?",
        correctOrder: ["more", "food", "you", "want"],
        options: ["you", "want", "more", "do", "food"],
        alternateAnswers: [["more", "food", "you", "want"]]
    },
    {
        english: "I am eating now.",
        correctOrder: ["now", "me", "eat"],
        options: ["now", "me", "eat", "am", "eating"],
        alternateAnswers: [["me", "now", "eat"]]
    },
    {
        english: "I want to go to the bathroom.",
        correctOrder: ["bathroom", "me", "want"],
        options: ["bathroom", "me", "want", "go", "to"],
        alternateAnswers: [["me", "want", "bathroom"], ["bathroom", "me", "want", "go"]]
    },
    {
        english: "Can you help me?",
        correctOrder: ["you", "help", "me"],
        options: ["me", "help", "can", "you"],
        alternateAnswers: [["you", "help", "me"], ["help", "me", "you"], ["me", "you", "help"], ["help", "you", "me"]]
    }
];

export const level2Questions = [
    {
        english: "I want to drink.",
        correctOrder: ["want", "drink"],
        alternateAnswers: [["me", "want", "drink"], ["i", "want", "drink"], ["drink", "want"]],
        hintWords: ["want", "drink"]
    },
    {
        english: "I need to go to the bathroom now.",
        correctOrder: ["now", "bathroom"],
        alternateAnswers: [["now", "me", "bathroom"], ["me", "now", "bathroom"], ["bathroom", "now"]],
        hintWords: ["now", "bathroom"]
    },
    {
        english: "You should drink now.",
        correctOrder: ["now", "you", "drink"],
        alternateAnswers: [["you", "drink", "now"], ["drink", "you", "now"]],
        hintWords: ["now", "you", "drink"]
    },
    {
        english: "I want to sleep.",
        correctOrder: ["me", "want", "sleep"],
        alternateAnswers: [["want", "sleep"], ["sleep", "me"], ["i", "want", "sleep"]],
        hintWords: ["me", "want", "sleep"]
    }    
];
