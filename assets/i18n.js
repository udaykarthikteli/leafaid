/* ===================== Leaf Aid — languages (EN / తెలుగు / हिन्दी) =====================
   How it works: the page stays written in English. This script swaps any text whose
   exact English wording is in the dictionaries below. To translate more text, just
   add another  'English text': 'translation'  line to both `te` and `hi`.
========================================================================================= */
(function () {
  const KEY = 'leafaid-lang';
  const LANGS = { en: 'English', te: 'తెలుగు', hi: 'हिन्दी' };

  const D = {
    te: {
      "See what's wrong with your leaves": "మీ ఆకులలో సమస్య ఏమిటో తెలుసుకోండి",
      "before": "అది",
      "it spreads.": "వ్యాపించక ముందే.",
      "Leaf Aid reads a single photo of a leaf and tells you exactly which disease is present, how confident it is, and — unlike a black box — precisely which spots, textures and edges led to that conclusion.": "Leaf Aid ఒక్క ఆకు ఫోటోను చదివి, ఏ వ్యాధి ఉందో, ఎంత నమ్మకంతో చెబుతోందో తెలియజేస్తుంది — బ్లాక్ బాక్స్‌లా కాకుండా, ఏ మచ్చలు, ఆకృతులు, అంచులు ఆ నిర్ణయానికి దారితీశాయో కచ్చితంగా చూపిస్తుంది.",
      "<3s": "<3 సెకన్లు",
      "◎ live camera feed": "◎ లైవ్ కెమెరా ఫీడ్",
      "Early blight detected": "ఎర్లీ బ్లైట్ గుర్తించబడింది",
      "Move your cursor to scan the leaf": "ఆకును స్కాన్ చేయడానికి కర్సర్‌ను కదిలించండి",
      "Trusted by growers & agronomists in": "రైతులు & వ్యవసాయ నిపుణుల నమ్మకం",
      "32 countries": "32 దేశాల్లో",
      "4 university plant-pathology labs": "4 విశ్వవిద్యాలయ మొక్కల రోగ నిర్ధారణ ల్యాబ్‌లు",
      "2,800+ field cooperatives": "2,800+ పొలం సహకార సంఘాలు",
      "1.1M diagnoses run": "11 లక్షల+ నిర్ధారణలు",
      "No lab equipment, no waiting for a specialist. Point your camera, and Leaf Aid does the rest — while showing its work at every step.": "ల్యాబ్ పరికరాలు లేవు, నిపుణుడి కోసం వేచి ఉండాల్సిన అవసరం లేదు. కెమెరా చూపించండి, మిగతాది Leaf Aid చూసుకుంటుంది — ప్రతి దశలో తన పనిని చూపిస్తూ.",
      "Snap a photo in natural light, or upload one from your gallery. Works on damaged, spotted or partially eaten leaves.": "సహజ వెలుతురులో ఫోటో తీయండి లేదా గ్యాలరీ నుండి అప్‌లోడ్ చేయండి. దెబ్బతిన్న, మచ్చలున్న లేదా పాక్షికంగా తినేసిన ఆకులపై కూడా పనిచేస్తుంది.",
      "A convolutional vision model segments the leaf, isolates lesions, textures and insect damage in under three seconds.": "కన్వల్యూషనల్ విజన్ మోడల్ ఆకును విభజించి, మచ్చలు, ఆకృతులు, కీటకాల నష్టాన్ని మూడు సెకన్లలోపే వేరు చేస్తుంది.",
      "A heatmap overlay shows exactly which regions drove the diagnosis, alongside a plain-language explanation.": "ఏ ప్రాంతాలు నిర్ధారణను నడిపించాయో హీట్‌మ్యాప్ చూపిస్తుంది, పక్కనే సులభమైన భాషలో వివరణ ఉంటుంది.",
      "Receive dosed treatment options, organic alternatives and a prevention checklist tailored to your crop.": "మీ పంటకు తగిన మోతాదుతో చికిత్స ఎంపికలు, సేంద్రీయ ప్రత్యామ్నాయాలు, నివారణ చెక్‌లిస్ట్ పొందండి.",
      "Leaf Aid isn't just a classifier — it's a full diagnosis-to-treatment workflow built for growers, students and agronomists.": "Leaf Aid కేవలం క్లాసిఫైయర్ కాదు — రైతులు, విద్యార్థులు, వ్యవసాయ నిపుణుల కోసం రూపొందించిన నిర్ధారణ నుండి చికిత్స వరకు పూర్తి వర్క్‌ఫ్లో.",
      "Every diagnosis ships with a Grad-CAM-style heatmap, bounding boxes on affected regions, and a written rationale — so you can verify the model instead of just trusting it.": "ప్రతి నిర్ధారణతో Grad-CAM తరహా హీట్‌మ్యాప్, ప్రభావిత ప్రాంతాలపై బాక్స్‌లు, రాతపూర్వక కారణం వస్తాయి — మోడల్‌ను గుడ్డిగా నమ్మకుండా మీరే ధృవీకరించుకోవచ్చు.",
      "Ask follow-up questions in plain language — \"is this contagious?\", \"what's a safe organic spray?\" — and get instant, grounded answers.": "సులభ భాషలో తదుపరి ప్రశ్నలు అడగండి — \"ఇది అంటువ్యాధిలా వ్యాపిస్తుందా?\", \"సురక్షిత సేంద్రీయ స్ప్రే ఏది?\" — వెంటనే సమాధానాలు పొందండి.",
      "Drag, drop or snap a photo. Leaf Aid handles blurry shots, mixed lighting and multiple leaves in one frame.": "ఫోటోను లాగి వదలండి లేదా తీయండి. అస్పష్టమైన షాట్లు, మిశ్రమ వెలుతురు, ఒకే ఫ్రేమ్‌లో అనేక ఆకులను Leaf Aid నిర్వహిస్తుంది.",
      "Dosed, crop-specific treatment plans plus a prevention checklist so the disease doesn't come back next season.": "మోతాదుతో పంట-నిర్దిష్ట చికిత్స ప్రణాళికలు, వచ్చే సీజన్‌లో వ్యాధి తిరిగి రాకుండా నివారణ చెక్‌లిస్ట్.",
      "Every scan is saved with its confidence score, severity and treatment history — so you can track how a field is recovering over an entire season.": "ప్రతి స్కాన్ నమ్మకం స్కోరు, తీవ్రత, చికిత్స చరిత్రతో సేవ్ అవుతుంది — సీజన్ మొత్తం పొలం ఎలా కోలుకుంటోందో ట్రాక్ చేయండి.",
      "High-influence region": "అధిక ప్రభావ ప్రాంతం",
      "Medium-influence region": "మధ్యస్థ ప్రభావ ప్రాంతం",
      "Detected object": "గుర్తించిన వస్తువు",
      "Saliency & Grad-CAM overlays": "సాలియెన్సీ & Grad-CAM ఓవర్‌లేలు",
      "See the exact pixels that pushed the model toward its answer, rendered directly on your photo.": "మోడల్‌ను సమాధానం వైపు నడిపించిన ఖచ్చితమైన పిక్సెల్స్‌ను మీ ఫోటోపైనే చూడండి.",
      "Region-level confidence": "ప్రాంత స్థాయి నమ్మకం",
      "Each detected lesion, hole or insect gets its own bounding box and confidence score — not just one number for the whole leaf.": "గుర్తించిన ప్రతి మచ్చ, రంధ్రం లేదా కీటకానికి దాని సొంత బాక్స్, నమ్మకం స్కోరు ఉంటుంది — మొత్తం ఆకుకు ఒకే సంఖ్య కాదు.",
      "Plain-language rationale": "సులభ భాషలో కారణం",
      "\"Concentric rings + yellow halo\" reads like an agronomist's note, not a probability vector.": "\"వలయాకార రింగులు + పసుపు హాలో\" అనేది సంభావ్యత వెక్టర్‌లా కాకుండా వ్యవసాయ నిపుణుడి నోట్‌లా ఉంటుంది.",
      "Exportable diagnosis report": "ఎగుమతి చేయగల నిర్ధారణ నివేదిక",
      "Share a clean PDF with a co-op, extension officer or supplier when a second opinion is needed.": "రెండవ అభిప్రాయం కావాల్సినప్పుడు సహకార సంఘం, విస్తరణ అధికారి లేదా సరఫరాదారుకు శుభ్రమైన PDF పంపండి.",
      "Every entry includes symptoms, causes, dosed treatment and a prevention checklist — written for the field, not a textbook.": "ప్రతి ఎంట్రీలో లక్షణాలు, కారణాలు, మోతాదుతో చికిత్స, నివారణ చెక్‌లిస్ట్ ఉంటాయి — పాఠ్యపుస్తకంలా కాకుండా పొలం కోసం రాసినవి.",
      "Concentric dark rings with a yellow halo, starting on older leaves.": "పసుపు హాలోతో వలయాకార ముదురు రింగులు, పాత ఆకులపై మొదలవుతాయి.",
      "White powdery patches spreading across the leaf surface.": "ఆకు ఉపరితలంపై వ్యాపించే తెల్లని పొడి మచ్చలు.",
      "Small orange pustules scattered across the leaf blade.": "ఆకు పత్రంపై చెల్లాచెదురుగా చిన్న నారింజ రంగు పొక్కులు.",
      "Irregular holes and chewed margins from active pests.": "చురుకైన కీటకాల వల్ల అక్రమ రంధ్రాలు, కొరికిన అంచులు.",
      "Water-soaked spots that merge into larger dark lesions.": "నీటిలో నానినట్లు కనిపించే మచ్చలు కలిసి పెద్ద ముదురు గాయాలుగా మారతాయి.",
      "Angular yellow patches with fuzzy gray undersides.": "కోణాకార పసుపు మచ్చలు, కింద భాగంలో మసక బూడిద రంగు.",
      "Leaf Aid caught early blight in our tomato rows four days before we would have noticed it walking the field. The heatmap made it easy to show new staff exactly what to look for.": "మా టమాటా వరుసల్లో పొలంలో నడుస్తూ మేము గమనించే నాలుగు రోజుల ముందే Leaf Aid ఎర్లీ బ్లైట్‌ను పట్టుకుంది. హీట్‌మ్యాప్ వల్ల కొత్త సిబ్బందికి ఏం చూడాలో సులభంగా చూపించగలిగాం.",
      "Explainable AI diagnosis for healthier crops — built with agronomists, tested in the field.": "ఆరోగ్యకరమైన పంటల కోసం వివరించదగిన AI నిర్ధారణ — వ్యవసాయ నిపుణులతో రూపొందించి, పొలంలో పరీక్షించబడింది.",
      "Crop": "పంట",
      "Disease name": "వ్యాధి పేరు",
      "Hi! I'm the Leaf Aid assistant 🌿 Ask me about a symptom, a treatment, or how to read a confidence score.": "హాయ్! నేను Leaf Aid సహాయకుడిని 🌿 లక్షణం, చికిత్స, లేదా నమ్మకం స్కోరును ఎలా చదవాలో నన్ను అడగండి.",
      "Search a disease or crop — e.g. tomato, mildew…": "వ్యాధి లేదా పంట వెతకండి — ఉదా. టమాటా, మిల్డ్యూ…",
      "Ask about a symptom or treatment…": "లక్షణం లేదా చికిత్స గురించి అడగండి…",
      "Search scans, diseases, crops…": "స్కాన్లు, వ్యాధులు, పంటలు వెతకండి…",
      "Search a disease or crop…": "వ్యాధి లేదా పంట వెతకండి…",
      "Here's what's happening across your fields this week.": "ఈ వారం మీ పొలాల్లో ఏం జరుగుతోందో ఇక్కడ చూడండి.",
      "Mon–Sun": "సోమ–ఆది",
      "Mon": "సోమ",
      "Tue": "మంగళ",
      "Wed": "బుధ",
      "Thu": "గురు",
      "Fri": "శుక్ర",
      "Sat": "శని",
      "Sun": "ఆది",
      "or click to browse — JPG, PNG up to 10MB": "లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి — JPG, PNG 10MB వరకు",
      "Model v4.2": "మోడల్ v4.2",
      "Use natural daylight — avoid strong flash or shadows.": "సహజ పగటి వెలుతురు వాడండి — ఫ్లాష్ లేదా నీడలు వద్దు.",
      "Fill the frame with a single leaf, spots and edges visible.": "ఫ్రేమ్‌లో ఒకే ఆకు నింపండి, మచ్చలు అంచులు కనిపించాలి.",
      "Hold the camera steady and about 20cm from the leaf.": "కెమెరాను స్థిరంగా, ఆకుకు సుమారు 20 సెం.మీ. దూరంలో పట్టుకోండి.",
      "Include both healthy and affected areas for context.": "సందర్భం కోసం ఆరోగ్యకరమైన మరియు ప్రభావిత భాగాలు రెండూ చేర్చండి.",
      "Ask the assistant": "సహాయకుడిని అడగండి",
      "Not sure what you're looking at? Open the chatbot and describe the symptom in your own words.": "ఏమి చూస్తున్నారో తెలియదా? చాట్‌బాట్ తెరిచి లక్షణాన్ని మీ సొంత మాటల్లో వివరించండి.",
      "Chat with Leaf Aid": "Leaf Aid తో చాట్ చేయండి",
      "Every diagnosis you've run, searchable by crop, disease or field.": "మీరు చేసిన ప్రతి నిర్ధారణ, పంట, వ్యాధి లేదా పొలం ద్వారా వెతకవచ్చు.",
      "Search and filter 120+ diseases across 40 crops.": "40 పంటల్లో 120+ వ్యాధులను వెతికి ఫిల్టర్ చేయండి.",
      "Concentric dark rings with a yellow halo.": "పసుపు హాలోతో వలయాకార ముదురు రింగులు.",
      "White powdery patches on the leaf surface.": "ఆకు ఉపరితలంపై తెల్లని పొడి మచ్చలు.",
      "Orange pustules scattered across the blade.": "ఆకు పత్రంపై చెల్లాచెదురుగా నారింజ పొక్కులు.",
      "Irregular holes from active pests.": "చురుకైన కీటకాల వల్ల అక్రమ రంధ్రాలు.",
      "Water-soaked spots merging into lesions.": "నీటిలో నానినట్లు మచ్చలు గాయాలుగా కలుస్తాయి.",
      "Angular yellow patches, fuzzy undersides.": "కోణాకార పసుపు మచ్చలు, కింద మసక పొర.",
      "Manage your profile and notification preferences.": "మీ ప్రొఫైల్, నోటిఫికేషన్ ప్రాధాన్యతలను నిర్వహించండి.",
      "Change photo": "ఫోటో మార్చండి",
      "Email": "ఈమెయిల్",
      "Primary crop": "ప్రధాన పంట",
      "Email me weekly field summaries": "వారపు పొలం సారాంశాలను ఈమెయిల్ చేయండి",
      "Save changes": "మార్పులను సేవ్ చేయండి",
      'Explainable Plant AI': 'వివరించదగిన మొక్కల AI',
      'Explainable AI · 40+ crops · Instant results': 'వివరించదగిన AI · 40+ పంటలు · తక్షణ ఫలితాలు',
      'Diagnose a leaf, free': 'ఆకును ఉచితంగా నిర్ధారించండి', 'See how it works': 'ఎలా పనిచేస్తుందో చూడండి',
      'Lab accuracy': 'ల్యాబ్ ఖచ్చితత్వం', 'Diseases mapped': 'గుర్తించిన వ్యాధులు', 'Per diagnosis': 'ప్రతి నిర్ధారణకు',
      'The process': 'ప్రక్రియ', 'From leaf to remedy in four steps.': 'ఆకు నుండి పరిష్కారం వరకు నాలుగు దశల్లో.',
      '01 — Capture': '01 — ఫోటో తీయండి', 'Photograph the leaf': 'ఆకు ఫోటో తీయండి',
      '02 — Scan': '02 — స్కాన్', 'The model examines it': 'మోడల్ పరిశీలిస్తుంది',
      '03 — Explain': '03 — వివరణ', 'See the reasoning': 'కారణాన్ని చూడండి',
      '04 — Act': '04 — చర్య', 'Get a treatment plan': 'చికిత్స ప్రణాళిక పొందండి',
      'Everything you need': 'మీకు కావలసినవన్నీ',
      'One tool, from first symptom to full recovery.': 'మొదటి లక్షణం నుండి పూర్తి కోలుకునే వరకు ఒకే సాధనం.',
      'Explainable AI, not a black box': 'వివరించదగిన AI, బ్లాక్ బాక్స్ కాదు', 'AI chatbot support': 'AI చాట్‌బాట్ సహాయం',
      'One-tap image upload': 'ఒక్క ట్యాప్‌తో ఫోటో అప్‌లోడ్', 'Treatment & prevention': 'చికిత్స & నివారణ',
      'A dashboard that remembers everything': 'అన్నీ గుర్తుంచుకునే డాష్‌బోర్డ్',
      'Trust, but verify — every single time.': 'నమ్మండి, కానీ ధృవీకరించండి — ప్రతిసారీ.',
      'Search 120+ diseases across 40 crops.': '40 పంటల్లో 120+ వ్యాధులను వెతకండి.',
      'All': 'అన్నీ', 'High severity': 'అధిక తీవ్రత', 'High risk': 'అధిక ప్రమాదం', 'Medium risk': 'మధ్యస్థ ప్రమాదం', 'Low risk': 'తక్కువ ప్రమాదం',
      'Tomato': 'టమాటా', 'Cucumber': 'దోసకాయ', 'Wheat': 'గోధుమ', 'Cabbage': 'క్యాబేజీ',
      'Early Blight': 'ఎర్లీ బ్లైట్', 'Powdery Mildew': 'పౌడరీ మిల్డ్యూ', 'Leaf Rust': 'ఆకు తుప్పు',
      'Insect Feeding Damage': 'కీటకాల నష్టం', 'Bacterial Leaf Spot': 'బ్యాక్టీరియల్ ఆకు మచ్చ',
      'Downy Mildew': 'డౌనీ మిల్డ్యూ', 'Healthy leaf': 'ఆరోగ్యకరమైన ఆకు',
      'Open full disease library': 'పూర్తి వ్యాధి లైబ్రరీ తెరవండి', 'Create free account': 'ఉచిత ఖాతా సృష్టించండి',
      'Your next diagnosis takes less time than reading this sentence.': 'మీ తదుపరి నిర్ధారణ ఈ వాక్యం చదవడం కంటే తక్కువ సమయం తీసుకుంటుంది.',
      'Product': 'ఉత్పత్తి', 'Account': 'ఖాతా', 'Create account': 'ఖాతా సృష్టించండి', 'My scans': 'నా స్కాన్లు',
      'Company': 'కంపెనీ', 'About': 'మా గురించి', 'Research': 'పరిశోధన', 'Contact': 'సంప్రదించండి',
      '© 2026 Leaf Aid. All rights reserved.': '© 2026 Leaf Aid. అన్ని హక్కులు రక్షితం.',
      'Made for growers, students & agronomists.': 'రైతులు, విద్యార్థులు & వ్యవసాయ నిపుణుల కోసం.',
      'Leaf Aid Assistant': 'Leaf Aid సహాయకుడు', 'Online': 'ఆన్‌లైన్',
      'Yellow spots on tomato leaves': 'టమాటా ఆకులపై పసుపు మచ్చలు', 'How to prevent mildew?': 'మిల్డ్యూను ఎలా నివారించాలి?',
      'What does confidence mean?': 'నమ్మకం అంటే ఏమిటి?', 'Explain my last diagnosis': 'నా చివరి నిర్ధారణను వివరించండి',
      'Treatment for early blight': 'ఎర్లీ బ్లైట్‌కు చికిత్స', 'Prevent it next season': 'వచ్చే సీజన్‌లో నివారించండి',
      'Raw photo': 'అసలు ఫోటో', 'AI heatmap': 'AI హీట్‌మ్యాప్',
      'HIGH SEVERITY': 'అధిక తీవ్రత', 'MEDIUM SEVERITY': 'మధ్యస్థ తీవ్రత', 'LOW SEVERITY': 'తక్కువ తీవ్రత',
      'Detected on Tomato leaf': 'టమాటా ఆకుపై గుర్తించబడింది', 'Detected on Cucumber leaf': 'దోసకాయ ఆకుపై గుర్తించబడింది',
      'Detected on Wheat leaf': 'గోధుమ ఆకుపై గుర్తించబడింది', 'Detected on Cabbage leaf': 'క్యాబేజీ ఆకుపై గుర్తించబడింది',
      'Home': 'హోమ్', 'How it works': 'ఎలా పనిచేస్తుంది', 'Disease library': 'వ్యాధుల లైబ్రరీ',
      'Explainable AI': 'వివరించదగిన AI', 'Dashboard': 'డాష్‌బోర్డ్', 'Log in': 'లాగిన్', 'Get started': 'ప్రారంభించండి',
      'Back to home': 'హోమ్‌కు తిరిగి', 'Back to login': 'లాగిన్‌కు తిరిగి',
      'Welcome back.': 'తిరిగి స్వాగతం.', 'Email address': 'ఈమెయిల్ చిరునామా', 'Password': 'పాస్‌వర్డ్',
      'Remember me': 'నన్ను గుర్తుంచుకో', 'Forgot password?': 'పాస్‌వర్డ్ మర్చిపోయారా?',
      'Log in to your dashboard': 'మీ డాష్‌బోర్డ్‌కు లాగిన్ అవ్వండి', 'New to Leaf Aid?': 'Leaf Aid కి కొత్తవారా?',
      'Create a free account': 'ఉచిత ఖాతా సృష్టించండి', 'Create your free account.': 'మీ ఉచిత ఖాతాను సృష్టించండి.',
      'First name': 'మొదటి పేరు', 'Last name': 'ఇంటి పేరు', 'Create my account': 'నా ఖాతాను సృష్టించు',
      'Already have an account?': 'ఇప్పటికే ఖాతా ఉందా?', "I'm signing up as a…": 'నేను నమోదు చేసుకునేది…',
      'Home gardener': 'ఇంటి తోటమాలి', 'Commercial grower': 'వాణిజ్య రైతు',
      'Agronomist / consultant': 'వ్యవసాయ నిపుణుడు / సలహాదారు', 'Student / researcher': 'విద్యార్థి / పరిశోధకుడు',
      'Forgot your password?': 'మీ పాస్‌వర్డ్ మర్చిపోయారా?', 'Send reset link': 'రీసెట్ లింక్ పంపండి',
      'Set a new password.': 'కొత్త పాస్‌వర్డ్ సెట్ చేయండి.', 'New password': 'కొత్త పాస్‌వర్డ్',
      'Confirm new password': 'కొత్త పాస్‌వర్డ్ నిర్ధారించండి', 'Update password': 'పాస్‌వర్డ్ నవీకరించండి',
      'Workspace': 'వర్క్‌స్పేస్', 'Overview': 'అవలోకనం', 'Diagnose': 'నిర్ధారణ', 'Scan history': 'స్కాన్ చరిత్ర',
      'Assistant': 'సహాయకుడు', 'Ask Leaf Aid': 'Leaf Aid ని అడగండి', 'Settings': 'సెట్టింగ్‌లు',
      'New diagnosis': 'కొత్త నిర్ధారణ', 'Scans this month': 'ఈ నెల స్కాన్లు',
      'High-severity cases': 'అధిక తీవ్రత కేసులు', 'Avg. confidence': 'సగటు నమ్మకం', 'Fields tracked': 'ట్రాక్ చేసిన పొలాలు',
      'Scans per day, this week': 'ఈ వారం రోజువారీ స్కాన్లు', 'Severity breakdown': 'తీవ్రత విభజన',
      'Recent scans': 'ఇటీవలి స్కాన్లు', 'View all': 'అన్నీ చూడండి', 'Diagnose a leaf': 'ఆకును నిర్ధారించండి',
      'Upload a clear photo — Leaf Aid detects the disease and shows exactly why.': 'స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి — Leaf Aid వ్యాధిని గుర్తించి కారణాన్ని చూపిస్తుంది.',
      'Upload photo': 'ఫోటో అప్‌లోడ్', 'Drag & drop a leaf photo': 'ఆకు ఫోటోను ఇక్కడ వదలండి', 'Choose photo': 'ఫోటో ఎంచుకోండి',
      'Symptoms': 'లక్షణాలు', 'Treatment': 'చికిత్స', 'Prevention': 'నివారణ', 'Tips for a great scan': 'మంచి స్కాన్ కోసం చిట్కాలు'
    },
    hi: {
      "See what's wrong with your leaves": "पत्तियों की समस्या जानें",
      "before": "फैलने",
      "it spreads.": "से पहले।",
      "Leaf Aid reads a single photo of a leaf and tells you exactly which disease is present, how confident it is, and — unlike a black box — precisely which spots, textures and edges led to that conclusion.": "Leaf Aid पत्ती की एक फ़ोटो पढ़कर बताता है कि कौन सा रोग है और वह कितना आश्वस्त है — और ब्लैक बॉक्स की तरह नहीं, बल्कि यह भी दिखाता है कि किन धब्बों, बनावटों और किनारों से यह निष्कर्ष निकला।",
      "<3s": "<3 सेकंड",
      "◎ live camera feed": "◎ लाइव कैमरा फ़ीड",
      "Early blight detected": "अर्ली ब्लाइट पहचाना गया",
      "Move your cursor to scan the leaf": "पत्ती स्कैन करने के लिए कर्सर हिलाएं",
      "Trusted by growers & agronomists in": "उत्पादकों और कृषि विशेषज्ञों का भरोसा",
      "32 countries": "32 देशों में",
      "4 university plant-pathology labs": "4 विश्वविद्यालय पादप-रोग विज्ञान प्रयोगशालाएँ",
      "2,800+ field cooperatives": "2,800+ कृषि सहकारी समितियाँ",
      "1.1M diagnoses run": "11 लाख+ निदान",
      "No lab equipment, no waiting for a specialist. Point your camera, and Leaf Aid does the rest — while showing its work at every step.": "न लैब उपकरण, न विशेषज्ञ का इंतज़ार। कैमरा घुमाइए, बाकी Leaf Aid करेगा — हर चरण में अपना काम दिखाते हुए।",
      "Snap a photo in natural light, or upload one from your gallery. Works on damaged, spotted or partially eaten leaves.": "प्राकृतिक रोशनी में फ़ोटो लें या गैलरी से अपलोड करें। क्षतिग्रस्त, धब्बेदार या आंशिक रूप से खाई गई पत्तियों पर भी काम करता है।",
      "A convolutional vision model segments the leaf, isolates lesions, textures and insect damage in under three seconds.": "कन्वोल्यूशनल विज़न मॉडल पत्ती को खंडों में बाँटकर तीन सेकंड से कम में घाव, बनावट और कीट क्षति अलग करता है।",
      "A heatmap overlay shows exactly which regions drove the diagnosis, alongside a plain-language explanation.": "हीटमैप ओवरले दिखाता है कि किन हिस्सों से निदान हुआ, साथ में सरल भाषा में व्याख्या।",
      "Receive dosed treatment options, organic alternatives and a prevention checklist tailored to your crop.": "अपनी फसल के अनुसार खुराक सहित उपचार विकल्प, जैविक विकल्प और रोकथाम चेकलिस्ट पाएं।",
      "Leaf Aid isn't just a classifier — it's a full diagnosis-to-treatment workflow built for growers, students and agronomists.": "Leaf Aid सिर्फ़ क्लासिफ़ायर नहीं है — यह उत्पादकों, छात्रों और कृषि विशेषज्ञों के लिए निदान से उपचार तक का पूरा वर्कफ़्लो है।",
      "Every diagnosis ships with a Grad-CAM-style heatmap, bounding boxes on affected regions, and a written rationale — so you can verify the model instead of just trusting it.": "हर निदान के साथ Grad-CAM जैसा हीटमैप, प्रभावित क्षेत्रों पर बाउंडिंग बॉक्स और लिखित कारण मिलता है — ताकि आप मॉडल पर आँख मूँदकर भरोसा करने की बजाय खुद जाँच सकें।",
      "Ask follow-up questions in plain language — \"is this contagious?\", \"what's a safe organic spray?\" — and get instant, grounded answers.": "सरल भाषा में अगले सवाल पूछें — \"क्या यह संक्रामक है?\", \"सुरक्षित जैविक स्प्रे कौन सा है?\" — और तुरंत जवाब पाएं।",
      "Drag, drop or snap a photo. Leaf Aid handles blurry shots, mixed lighting and multiple leaves in one frame.": "फ़ोटो खींचकर छोड़ें या लें। धुंधली फ़ोटो, मिश्रित रोशनी और एक फ़्रेम में कई पत्तियाँ — Leaf Aid संभाल लेता है।",
      "Dosed, crop-specific treatment plans plus a prevention checklist so the disease doesn't come back next season.": "खुराक सहित फसल-विशिष्ट उपचार योजनाएँ और रोकथाम चेकलिस्ट, ताकि अगले सीज़न में रोग वापस न आए।",
      "Every scan is saved with its confidence score, severity and treatment history — so you can track how a field is recovering over an entire season.": "हर स्कैन विश्वास स्कोर, गंभीरता और उपचार इतिहास के साथ सहेजा जाता है — पूरे सीज़न में खेत की रिकवरी ट्रैक करें।",
      "High-influence region": "उच्च प्रभाव क्षेत्र",
      "Medium-influence region": "मध्यम प्रभाव क्षेत्र",
      "Detected object": "पहचानी गई वस्तु",
      "Saliency & Grad-CAM overlays": "सैलियन्सी और Grad-CAM ओवरले",
      "See the exact pixels that pushed the model toward its answer, rendered directly on your photo.": "जिन पिक्सल ने मॉडल को उसके उत्तर की ओर धकेला, उन्हें सीधे अपनी फ़ोटो पर देखें।",
      "Region-level confidence": "क्षेत्र-स्तर का विश्वास",
      "Each detected lesion, hole or insect gets its own bounding box and confidence score — not just one number for the whole leaf.": "पहचाने गए हर घाव, छेद या कीट का अपना बॉक्स और विश्वास स्कोर होता है — पूरी पत्ती के लिए सिर्फ़ एक संख्या नहीं।",
      "Plain-language rationale": "सरल भाषा में कारण",
      "\"Concentric rings + yellow halo\" reads like an agronomist's note, not a probability vector.": "\"संकेंद्रित छल्ले + पीला घेरा\" किसी प्रायिकता वेक्टर की तरह नहीं, कृषि विशेषज्ञ के नोट जैसा पढ़ा जाता है।",
      "Exportable diagnosis report": "निर्यात योग्य निदान रिपोर्ट",
      "Share a clean PDF with a co-op, extension officer or supplier when a second opinion is needed.": "दूसरी राय चाहिए तो सहकारी समिति, विस्तार अधिकारी या आपूर्तिकर्ता को साफ़ PDF भेजें।",
      "Every entry includes symptoms, causes, dosed treatment and a prevention checklist — written for the field, not a textbook.": "हर प्रविष्टि में लक्षण, कारण, खुराक सहित उपचार और रोकथाम चेकलिस्ट है — पाठ्यपुस्तक के लिए नहीं, खेत के लिए लिखी गई।",
      "Concentric dark rings with a yellow halo, starting on older leaves.": "पीले घेरे के साथ संकेंद्रित गहरे छल्ले, पुरानी पत्तियों से शुरू।",
      "White powdery patches spreading across the leaf surface.": "पत्ती की सतह पर फैलते सफ़ेद पाउडर जैसे धब्बे।",
      "Small orange pustules scattered across the leaf blade.": "पत्ती के फलक पर बिखरे छोटे नारंगी फफोले।",
      "Irregular holes and chewed margins from active pests.": "सक्रिय कीटों से अनियमित छेद और कुतरे किनारे।",
      "Water-soaked spots that merge into larger dark lesions.": "पानी से भीगे धब्बे जो मिलकर बड़े गहरे घाव बन जाते हैं।",
      "Angular yellow patches with fuzzy gray undersides.": "कोणीय पीले धब्बे, नीचे की ओर रोएँदार धूसर परत।",
      "Leaf Aid caught early blight in our tomato rows four days before we would have noticed it walking the field. The heatmap made it easy to show new staff exactly what to look for.": "खेत में घूमते हुए हमें पता चलने से चार दिन पहले ही Leaf Aid ने हमारी टमाटर की कतारों में अर्ली ब्लाइट पकड़ लिया। हीटमैप से नए स्टाफ़ को दिखाना आसान हो गया कि क्या देखना है।",
      "Explainable AI diagnosis for healthier crops — built with agronomists, tested in the field.": "स्वस्थ फसलों के लिए व्याख्यात्मक AI निदान — कृषि विशेषज्ञों के साथ बनाया, खेत में परखा गया।",
      "Crop": "फसल",
      "Disease name": "रोग का नाम",
      "Hi! I'm the Leaf Aid assistant 🌿 Ask me about a symptom, a treatment, or how to read a confidence score.": "नमस्ते! मैं Leaf Aid सहायक हूँ 🌿 किसी लक्षण, उपचार या विश्वास स्कोर पढ़ने के बारे में मुझसे पूछें।",
      "Search a disease or crop — e.g. tomato, mildew…": "रोग या फसल खोजें — जैसे टमाटर, मिल्ड्यू…",
      "Ask about a symptom or treatment…": "किसी लक्षण या उपचार के बारे में पूछें…",
      "Search scans, diseases, crops…": "स्कैन, रोग, फसलें खोजें…",
      "Search a disease or crop…": "रोग या फसल खोजें…",
      "Here's what's happening across your fields this week.": "इस सप्ताह आपके खेतों में क्या हो रहा है, यह देखें।",
      "Mon–Sun": "सोम–रवि",
      "Mon": "सोम",
      "Tue": "मंगल",
      "Wed": "बुध",
      "Thu": "गुरु",
      "Fri": "शुक्र",
      "Sat": "शनि",
      "Sun": "रवि",
      "or click to browse — JPG, PNG up to 10MB": "या ब्राउज़ करने के लिए क्लिक करें — JPG, PNG 10MB तक",
      "Model v4.2": "मॉडल v4.2",
      "Use natural daylight — avoid strong flash or shadows.": "प्राकृतिक दिन की रोशनी में लें — तेज़ फ़्लैश या छाया से बचें।",
      "Fill the frame with a single leaf, spots and edges visible.": "फ़्रेम में एक ही पत्ती रखें, धब्बे और किनारे दिखें।",
      "Hold the camera steady and about 20cm from the leaf.": "कैमरा स्थिर रखें और पत्ती से लगभग 20 सेमी दूर रखें।",
      "Include both healthy and affected areas for context.": "संदर्भ के लिए स्वस्थ और प्रभावित दोनों हिस्से शामिल करें।",
      "Ask the assistant": "सहायक से पूछें",
      "Not sure what you're looking at? Open the chatbot and describe the symptom in your own words.": "समझ नहीं आ रहा कि क्या देख रहे हैं? चैटबॉट खोलें और लक्षण अपने शब्दों में बताएं।",
      "Chat with Leaf Aid": "Leaf Aid से चैट करें",
      "Every diagnosis you've run, searchable by crop, disease or field.": "आपके किए हर निदान को फसल, रोग या खेत के आधार पर खोजें।",
      "Search and filter 120+ diseases across 40 crops.": "40 फसलों में 120+ रोग खोजें और फ़िल्टर करें।",
      "Concentric dark rings with a yellow halo.": "पीले घेरे के साथ संकेंद्रित गहरे छल्ले।",
      "White powdery patches on the leaf surface.": "पत्ती की सतह पर सफ़ेद पाउडर जैसे धब्बे।",
      "Orange pustules scattered across the blade.": "फलक पर बिखरे नारंगी फफोले।",
      "Irregular holes from active pests.": "सक्रिय कीटों से अनियमित छेद।",
      "Water-soaked spots merging into lesions.": "पानी से भीगे धब्बे घावों में मिल जाते हैं।",
      "Angular yellow patches, fuzzy undersides.": "कोणीय पीले धब्बे, नीचे रोएँदार परत।",
      "Manage your profile and notification preferences.": "अपनी प्रोफ़ाइल और सूचना प्राथमिकताएँ प्रबंधित करें।",
      "Change photo": "फ़ोटो बदलें",
      "Email": "ईमेल",
      "Primary crop": "मुख्य फसल",
      "Email me weekly field summaries": "साप्ताहिक खेत सारांश ईमेल करें",
      "Save changes": "बदलाव सहेजें",
      'Explainable Plant AI': 'व्याख्यात्मक पौध AI',
      'Explainable AI · 40+ crops · Instant results': 'व्याख्यात्मक AI · 40+ फसलें · तुरंत परिणाम',
      'Diagnose a leaf, free': 'पत्ती का निःशुल्क निदान करें', 'See how it works': 'देखें यह कैसे काम करता है',
      'Lab accuracy': 'लैब सटीकता', 'Diseases mapped': 'मैप किए गए रोग', 'Per diagnosis': 'प्रति निदान',
      'The process': 'प्रक्रिया', 'From leaf to remedy in four steps.': 'पत्ती से समाधान तक चार चरणों में।',
      '01 — Capture': '01 — फ़ोटो लें', 'Photograph the leaf': 'पत्ती की फ़ोटो लें',
      '02 — Scan': '02 — स्कैन', 'The model examines it': 'मॉडल जाँच करता है',
      '03 — Explain': '03 — व्याख्या', 'See the reasoning': 'कारण देखें',
      '04 — Act': '04 — कार्रवाई', 'Get a treatment plan': 'उपचार योजना पाएं',
      'Everything you need': 'आपको जो कुछ चाहिए',
      'One tool, from first symptom to full recovery.': 'पहले लक्षण से पूरी रिकवरी तक एक ही टूल।',
      'Explainable AI, not a black box': 'व्याख्यात्मक AI, ब्लैक बॉक्स नहीं', 'AI chatbot support': 'AI चैटबॉट सहायता',
      'One-tap image upload': 'एक टैप में फ़ोटो अपलोड', 'Treatment & prevention': 'उपचार और रोकथाम',
      'A dashboard that remembers everything': 'ऐसा डैशबोर्ड जो सब याद रखता है',
      'Trust, but verify — every single time.': 'भरोसा करें, पर जाँचें — हर बार।',
      'Search 120+ diseases across 40 crops.': '40 फसलों में 120+ रोग खोजें।',
      'All': 'सभी', 'High severity': 'उच्च गंभीरता', 'High risk': 'उच्च जोखिम', 'Medium risk': 'मध्यम जोखिम', 'Low risk': 'कम जोखिम',
      'Tomato': 'टमाटर', 'Cucumber': 'खीरा', 'Wheat': 'गेहूँ', 'Cabbage': 'पत्तागोभी',
      'Early Blight': 'अर्ली ब्लाइट', 'Powdery Mildew': 'पाउडरी मिल्ड्यू', 'Leaf Rust': 'पत्ती रतुआ',
      'Insect Feeding Damage': 'कीट क्षति', 'Bacterial Leaf Spot': 'जीवाणु पत्ती धब्बा',
      'Downy Mildew': 'डाउनी मिल्ड्यू', 'Healthy leaf': 'स्वस्थ पत्ती',
      'Open full disease library': 'पूरी रोग लाइब्रेरी खोलें', 'Create free account': 'निःशुल्क खाता बनाएं',
      'Your next diagnosis takes less time than reading this sentence.': 'आपका अगला निदान इस वाक्य को पढ़ने से भी कम समय लेता है।',
      'Product': 'उत्पाद', 'Account': 'खाता', 'Create account': 'खाता बनाएं', 'My scans': 'मेरे स्कैन',
      'Company': 'कंपनी', 'About': 'हमारे बारे में', 'Research': 'शोध', 'Contact': 'संपर्क',
      '© 2026 Leaf Aid. All rights reserved.': '© 2026 Leaf Aid. सर्वाधिकार सुरक्षित।',
      'Made for growers, students & agronomists.': 'उत्पादकों, छात्रों और कृषि विशेषज्ञों के लिए।',
      'Leaf Aid Assistant': 'Leaf Aid सहायक', 'Online': 'ऑनलाइन',
      'Yellow spots on tomato leaves': 'टमाटर की पत्तियों पर पीले धब्बे', 'How to prevent mildew?': 'मिल्ड्यू से कैसे बचें?',
      'What does confidence mean?': 'विश्वास (कॉन्फिडेंस) का क्या मतलब है?', 'Explain my last diagnosis': 'मेरा पिछला निदान समझाएं',
      'Treatment for early blight': 'अर्ली ब्लाइट का उपचार', 'Prevent it next season': 'अगले सीज़न में रोकें',
      'Raw photo': 'मूल फ़ोटो', 'AI heatmap': 'AI हीटमैप',
      'HIGH SEVERITY': 'उच्च गंभीरता', 'MEDIUM SEVERITY': 'मध्यम गंभीरता', 'LOW SEVERITY': 'कम गंभीरता',
      'Detected on Tomato leaf': 'टमाटर की पत्ती पर पहचाना गया', 'Detected on Cucumber leaf': 'खीरे की पत्ती पर पहचाना गया',
      'Detected on Wheat leaf': 'गेहूँ की पत्ती पर पहचाना गया', 'Detected on Cabbage leaf': 'पत्तागोभी की पत्ती पर पहचाना गया',
      'Home': 'होम', 'How it works': 'यह कैसे काम करता है', 'Disease library': 'रोग पुस्तकालय',
      'Explainable AI': 'व्याख्यात्मक AI', 'Dashboard': 'डैशबोर्ड', 'Log in': 'लॉग इन', 'Get started': 'शुरू करें',
      'Back to home': 'होम पर वापस', 'Back to login': 'लॉगिन पर वापस',
      'Welcome back.': 'वापसी पर स्वागत है।', 'Email address': 'ईमेल पता', 'Password': 'पासवर्ड',
      'Remember me': 'मुझे याद रखें', 'Forgot password?': 'पासवर्ड भूल गए?',
      'Log in to your dashboard': 'अपने डैशबोर्ड में लॉग इन करें', 'New to Leaf Aid?': 'Leaf Aid पर नए हैं?',
      'Create a free account': 'निःशुल्क खाता बनाएं', 'Create your free account.': 'अपना निःशुल्क खाता बनाएं।',
      'First name': 'पहला नाम', 'Last name': 'अंतिम नाम', 'Create my account': 'मेरा खाता बनाएं',
      'Already have an account?': 'पहले से खाता है?', "I'm signing up as a…": 'मैं इस रूप में साइन अप कर रहा/रही हूँ…',
      'Home gardener': 'घरेलू माली', 'Commercial grower': 'व्यावसायिक उत्पादक',
      'Agronomist / consultant': 'कृषि विशेषज्ञ / सलाहकार', 'Student / researcher': 'छात्र / शोधकर्ता',
      'Forgot your password?': 'क्या आप अपना पासवर्ड भूल गए?', 'Send reset link': 'रीसेट लिंक भेजें',
      'Set a new password.': 'नया पासवर्ड सेट करें।', 'New password': 'नया पासवर्ड',
      'Confirm new password': 'नया पासवर्ड पुष्टि करें', 'Update password': 'पासवर्ड अपडेट करें',
      'Workspace': 'वर्कस्पेस', 'Overview': 'अवलोकन', 'Diagnose': 'निदान', 'Scan history': 'स्कैन इतिहास',
      'Assistant': 'सहायक', 'Ask Leaf Aid': 'Leaf Aid से पूछें', 'Settings': 'सेटिंग्स',
      'New diagnosis': 'नया निदान', 'Scans this month': 'इस महीने के स्कैन',
      'High-severity cases': 'उच्च गंभीरता के मामले', 'Avg. confidence': 'औसत विश्वास', 'Fields tracked': 'ट्रैक किए गए खेत',
      'Scans per day, this week': 'इस सप्ताह प्रतिदिन स्कैन', 'Severity breakdown': 'गंभीरता का विवरण',
      'Recent scans': 'हाल के स्कैन', 'View all': 'सभी देखें', 'Diagnose a leaf': 'पत्ती का निदान करें',
      'Upload a clear photo — Leaf Aid detects the disease and shows exactly why.': 'स्पष्ट फ़ोटो अपलोड करें — Leaf Aid रोग पहचानता है और कारण दिखाता है।',
      'Upload photo': 'फ़ोटो अपलोड करें', 'Drag & drop a leaf photo': 'पत्ती की फ़ोटो यहाँ खींचकर छोड़ें', 'Choose photo': 'फ़ोटो चुनें',
      'Symptoms': 'लक्षण', 'Treatment': 'उपचार', 'Prevention': 'रोकथाम', 'Tips for a great scan': 'बेहतर स्कैन के लिए सुझाव'
    }
  };

  const seen = new WeakMap(); // text node -> { src: english, out: last written value }
  const W = { Low: { te: 'తక్కువ', hi: 'कम' }, Medium: { te: 'మధ్యస్థ', hi: 'मध्यम' }, High: { te: 'అధిక', hi: 'उच्च' } };
  const PATTERNS = [ // for text that contains numbers or names
    [/^(\d+)% confidence$/, { te: '$1% నమ్మకం', hi: '$1% विश्वास' }],
    [/^(\d+) crops$/, { te: '$1 పంటలు', hi: '$1 फसलें' }],
    [/^Welcome back, (.+)$/, { te: 'తిరిగి స్వాగతం, $1', hi: 'वापसी पर स्वागत है, $1' }]
  ];

  function translate(t, lang) {
    if (lang === 'en' || !D[lang]) return null;
    if (D[lang][t]) return D[lang][t];
    for (const [re, o] of PATTERNS) if (re.test(t)) return t.replace(re, o[lang]);
    const m = t.match(/^(Low|Medium|High) — (\d+)%$/);
    return m ? W[m[1]][lang] + ' — ' + m[2] + '%' : null;
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const tag = n.parentNode && n.parentNode.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') continue;
      let rec = seen.get(n);
      // text changed by other code since we last wrote it -> treat as new English source
      if (!rec || (n.nodeValue !== rec.out && n.nodeValue !== rec.src)) rec = { src: n.nodeValue, out: n.nodeValue };
      const t = rec.src.trim();
      if (!t) continue;
      const hit = translate(t, lang);
      rec.out = hit ? rec.src.replace(t, hit) : rec.src;
      if (n.nodeValue !== rec.out) n.nodeValue = rec.out;
      seen.set(n, rec);
    }
    document.querySelectorAll('[placeholder]').forEach(el => {
      if (!el.dataset.phEn) el.dataset.phEn = el.getAttribute('placeholder');
      el.setAttribute('placeholder', translate(el.dataset.phEn, lang) || el.dataset.phEn);
    });
  }

  let obs = null, timer = null;
  function refresh() {
    if (obs) obs.disconnect();
    apply(currentLang());
    if (obs) obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  // dynamic content (welcome line, scan rows, diagnosis result, chat) gets translated too
  window.leafaidTranslate = refresh;

  function currentLang() {
    try { return localStorage.getItem(KEY) || 'en'; } catch (e) { return 'en'; }
  }

  function addSwitcher(lang) {
    const sel = document.createElement('select');
    sel.setAttribute('aria-label', 'Language');
    sel.style.cssText = 'padding:6px 10px;border-radius:999px;border:1px solid rgba(128,128,128,.4);background:rgba(255,255,255,.9);color:#0B3D2E;font:600 .8rem inherit;cursor:pointer;';
    Object.keys(LANGS).forEach(k => sel.add(new Option(LANGS[k], k)));
    sel.value = lang;
    sel.addEventListener('change', () => {
      try { localStorage.setItem(KEY, sel.value); } catch (e) {}
      refresh();
    });
    const host = document.querySelector('.nav-cta') || document.querySelector('.topbar-actions');
    if (host) host.prepend(sel);
    else { sel.style.cssText += 'position:fixed;top:14px;right:14px;z-index:50;'; document.body.appendChild(sel); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lang = currentLang();
    addSwitcher(lang);
    obs = new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(refresh, 80); });
    refresh();
  });
})();
