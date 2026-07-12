    const STORAGE_KEY = "cycletrack-v2";

    const PHASES = {
      menstrual: { name:"Menstrual", emoji:"🌑", color:"#C2185B", bg:"#FCE4EC", days:"Days 1–5", description:"Your period. Hormones are at their lowest.", energy:"Low", workouts:["Gentle yoga","Walking","Stretching","Light pilates"], tips:"Listen to your body — rest is productive. Lower intensity is key. Iron-rich foods help replenish.", avoid:"Heavy lifting, HIIT, intense cardio" },
      follicular: { name:"Follicular", emoji:"🌒", color:"#7B1FA2", bg:"#F3E5F5", days:"Days 6–13", description:"Estrogen rises as follicles develop. Energy is building.", energy:"Building → High", workouts:["Strength training","Running","Cycling","Dance classes","HIIT"], tips:"Great time to try new workouts or push heavier weights. Coordination and endurance improve.", avoid:"Nothing — take advantage of this phase!" },
      ovulation: { name:"Ovulation", emoji:"🌕", color:"#F57F17", bg:"#FFFDE7", days:"Days 14–16", description:"Peak estrogen + testosterone surge. You're at your strongest.", energy:"Peak", workouts:["Max effort lifts","Sprints","Competitive sports","Group classes"], tips:"Your personal bests are most likely during this window. High motivation and pain tolerance.", avoid:"Being too cautious — this is your power window!" },
      luteal: { name:"Luteal", emoji:"🌘", color:"#2E7D32", bg:"#E8F5E9", days:"Days 17–28", description:"Progesterone rises. Energy gradually dips toward period.", energy:"Moderate → Low", workouts:["Moderate strength","Barre","Swimming","Hiking","Pilates"], tips:"First half (days 17–21) still good for moderate training. Ease off in second half. Magnesium helps with PMS.", avoid:"Pushing through exhaustion — recovery is harder now" }
    };

    const MOODS = ["😄","😊","😐","😔","😤","😰","🥱","🤩"];
    const SYMPTOMS = ["Cramps","Bloating","Headache","Backache","Tender breasts","Nausea","Fatigue","Acne","Cravings","Insomnia","Brain fog","Anxiety"];
    const FLOW_LEVELS = [{emoji:"💧",label:"Spotting"},{emoji:"🩸",label:"Light"},{emoji:"🩸🩸",label:"Medium"},{emoji:"🩸🩸🩸",label:"Heavy"},{emoji:"🌊",label:"Very heavy"}];
    const ENERGY_LEVELS = ["⚡️⚡️⚡️","⚡️⚡️","⚡️","😴"];
