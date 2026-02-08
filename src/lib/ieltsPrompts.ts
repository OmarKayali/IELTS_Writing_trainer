// Re-export types for convenience
export type { IELTSEvaluation, BandUpgradeSuggestion, ErrorPattern, VocabSuggestion, ExaminerFeedback } from './ieltsTypes';

export interface TrainingTask {
    id: string;
    title: string;
    category: 'Sentence Structure' | 'Paragraph Cohesion' | 'Full Essay';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    sourceText: string;
}

export interface WritingTask {
    id: string;
    type: 'Task 1' | 'Task 2';
    category: 'Bar Chart' | 'Line Graph' | 'Map' | 'Process' | 'Opinion' | 'Discussion' | 'Problem/Solution';
    prompt: string;
    imageUrl?: string; // Optional chart/diagram URL
    modelAnswer: string; // Band 9.0 model answer (required)
    dataOutline?: string; // Ground truth data for AI verification (Task 1 only)
    wordCount?: number; // Pre-calculated word count for model answer
}

export const TRAINING_TASKS: TrainingTask[] = [
    {
        id: 't1',
        title: 'Passive Voice (Process)',
        category: 'Sentence Structure',
        difficulty: 'Medium',
        sourceText: "First, the raw materials are collected and transported to the factory. Once there, they are sorted by size and quality before being washed thoroughly. After the cleaning process is complete, the materials are heated to a high temperature to remove any impurities. Finally, the finished product is packaged and distributed to retailers."
    },
    {
        id: 't2',
        title: 'Complex Comparisons',
        category: 'Sentence Structure',
        difficulty: 'Hard',
        sourceText: "While the number of tourists visiting the museum increased significantly in 2010, reaching a peak of 5 million, the figures for the subsequent year witnessed a dramatic decline, falling to just over 3 million. This equates to a drop of approximately 40%, which was the sharpest decrease recorded over the entire decade."
    },
    {
        id: 't3',
        title: 'Introductory Paragraphs',
        category: 'Paragraph Cohesion',
        difficulty: 'Medium',
        sourceText: "The chart provides data regarding the varying expenditure of households in five distinct European countries in 2015. Overall, it is evident that housing and food were the primary expenses in all nations, while leisure activities accounted for the smallest share of the budget. France and Germany recorded the highest overall spending figures."
    },
    {
        id: 't4',
        title: 'Band 9.0 Task 2 Essay',
        category: 'Full Essay',
        difficulty: 'Hard',
        sourceText: "In recent years, the debate over whether governments should prioritize healthcare or education funding has intensified. In my opinion, while both sectors are vital for national development, healthcare warrants the lion's share of resources due to its immediate impact on the workforce's productivity and well-being.\n\nFirstly, a healthy population is the bedrock of a thriving economy. Without access to quality medical services, preventable diseases can ravage the workforce, leading to significant economic downturns. For instance, the recent global health crisis demonstrated how fragile economies are when public health systems collapse. Therefore, investing in hospitals and preventative care acts as an insurance policy for economic stability.\n\nSecondly, while education is crucial for long-term growth, its benefits are realized over decades. Conversely, healthcare interventions have immediate effects. A child saved from illness today becomes a student tomorrow; a worker treated for injury returns to the tax base within weeks. Thus, prioritizing health creates the very conditions necessary for education to succeed.\n\nIn conclusion, although education facilitates future innovation, healthcare ensures the survival and stability of the present society. Consequently, I firmly believe that allocating a larger portion of the budget to healthcare is the most pragmatic approach for governments to take."
    },
    {
        id: 't5',
        title: 'Academic Formal Tone',
        category: 'Paragraph Cohesion',
        difficulty: 'Easy',
        sourceText: "There are several reasons why traffic congestion has become a pressing issue in urban areas. The primary factor is the exponential growth in private vehicle ownership, driven by increased disposable income. Furthermore, public transport systems in many cities remain underdeveloped and unreliable, leaving commuters with few viable alternatives to driving."
    }
];

export const WRITING_TASKS: WritingTask[] = [
    {
        id: 'w1',
        type: 'Task 1',
        category: 'Bar Chart',
        prompt: "The chart below shows the amount of money spent on consumer goods (cars, computers, books, perfume and cameras) in France and the UK in 2010. Units are measured in pounds sterling.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        imageUrl: "/images/bar_chart.png",
        dataOutline: "Units: Pounds Sterling (£). NOT Billions. Range is 0 to 500,000. \n- Cars: UK (~450k) > France (~400k). Highest for both.\n- Computers: France (~380k) > UK (350k).\n- Books: UK (400k) > France (300k).\n- Perfume: France (200k) > UK (~140k). Lowest for UK.\n- Cameras: UK (360k) > France (150k). Lowest for France.\nSignificant diff: Cameras.",
        modelAnswer: "The chart illustrates the amount of money spent on five consumer goods in France and the UK in 2010. Overall, the UK spent more on consumer goods than France. Both nations spent the most on cars, whereas the least expenditure was on perfume in the UK and cameras in France. The most significant difference between the two countries was seen in camera sales.\n\nIn terms of cars, UK residents spent about £450,000, slightly surpassing the French at £400,000. Similarly, British expenditure on books was higher, at £400,000 compared to £300,000 in France. Notably, UK spending on cameras (over £350,000) was more than double that of France, which totaled only £150,000.\n\nConversely, French expenditure was higher for the remaining items. France spent above £350,000 on computers, marginally exceeding the British figure of £350,000. Neither country spent heavily on perfume, which accounted for £200,000 in France and under £150,000 in the UK.",
        wordCount: 169
    },
    {
        id: 'w2',
        type: 'Task 1',
        category: 'Map',
        prompt: "The maps below show the changes in a town named Meadowside between 1962 and the present day.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        imageUrl: "/images/map_meadowside.png",
        dataOutline: "Three time periods: 1962, 1985, Present.\n1962: Two separate settlements - Meadowside (west) with small road, Fonton (east) with railway.\n1985: Main road connects them. Meadowside added: housing estate (west), leisure complex + supermarket (south).\nPresent: Merged conurbation. Railway extended west to new station. Hotel built north of station. Business park south of station.",
        modelAnswer: "The maps illustrate the development of Meadowside village and the neighbouring town of Fonton over three periods: 1962, 1985, and the present day. Overall, Meadowside expanded significantly, merging with Fonton to form a large suburb, accompanied by major developments in infrastructure and facilities.\n\nIn 1962, Meadowside and Fonton were distinct settlements with no connecting transport links. Fonton possessed a railway line to the north, while Meadowside, situated to the west, was accessed solely by a small road.\n\nBy 1985, both areas had grown considerably. The small road in Meadowside was upgraded to a main road and extended eastward to join Fonton. Additionally, Meadowside saw the construction of a housing estate in the west, along with a leisure complex and supermarket in the south.\n\nCurrently, Meadowside and Fonton have merged into a single conurbation. The railway line has been extended westward to a new train station. North of the station, a hotel has been built, while a business park has been established to the south.",
        wordCount: 164
    },
    {
        id: 'w3',
        type: 'Task 1',
        category: 'Process',
        prompt: "The diagram below shows the life cycle of a ladybird.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        imageUrl: "/images/process_ladybird.png",
        dataOutline: "Four stages: egg → larva → pupa → adult.\nEgg: Laid on underside of leaf. Duration: ~3 weeks.\nLarva: Emerges from egg, rapid growth period, consumes food. Duration: ~2 weeks.\nPupa: Larva attaches to leaf, metamorphosis inside. Duration: ~1 week.\nAdult: Emerges, mates, lays eggs (cycle repeats). Total cycle: ~6 weeks.",
        modelAnswer: "The diagram illustrates the four main stages in the life cycle of a ladybird, spanning from the initial laying of eggs to the development of a mature adult. Overall, the complete biological cycle takes approximately six weeks under normal conditions.\n\nInitially, the adult ladybird lays its eggs, typically on the protective underside of a leaf to shield them from predators. After approximately three weeks, these eggs hatch, and small larvae emerge. The larval stage is a period of rapid growth lasting about two weeks. During this critical phase, the larvae consume large quantities of food, primarily aphids, to fuel their development and increase their body mass substantially before progressing to the next stage.\n\nFollowing the larval period, the creatures attach themselves securely to a leaf surface to begin pupation. Inside the protective pupa case, a remarkable metamorphosis occurs over the course of roughly one week, during which the larva's body structure completely reorganizes. Finally, a fully formed adult ladybird emerges from the pupa case, displaying its characteristic spotted wing covers. This new adult will eventually reach sexual maturity, mate with other ladybirds, and lay eggs, thereby continuing the biological cycle perpetually.",
        wordCount: 175
    },
    {
        id: 'w4',
        type: 'Task 2',
        category: 'Problem/Solution',
        prompt: "Some people believe that the best way to solve environmental problems is to increase the price of fuel. To what extent do you agree or disagree?",
        modelAnswer: "The proposal to increase fuel prices as a primary solution to environmental degradation is a contentious issue. While I acknowledge that higher costs could discourage unnecessary consumption, I strongly disagree that this is the best solitary approach, as it disproportionately affects low-income individuals and fails to address the root causes of pollution.\n\nProponents argue that hiking fuel prices applies basic economic principles: when a commodity becomes expensive, demand drops. Theoretically, this would force commuters to switch to public transport or electric vehicles, thereby reducing carbon emissions. This market-based mechanism has proven effective in certain contexts, such as Singapore's congestion pricing. However, this logic assumes the existence of viable alternatives. In many rural or developing regions, public transport is non-existent or severely inadequate. For these populations, fuel is a necessity, not a luxury. Increasing prices would likely lead to inflation, reduced economic productivity, and widespread hardship rather than a green revolution.\n\nA more effective strategy would be a multi-pronged approach combining carrots and sticks. Governments should subsidize green technologies to make them affordable while simultaneously investing in robust public infrastructure, such as electric bus networks and cycling lanes. For example, the rapid adoption of EVs in Norway was driven primarily by tax incentives and free parking, not just punitive fuel costs. Furthermore, strict corporate regulations on industrial emissions would have a far greater impact than penalizing individual motorists, given that heavy industry accounts for a disproportionate share of global greenhouse gas emissions.\n\nIn conclusion, while increasing fuel prices might play a small role in a broader strategy, it is too blunt an instrument to be considered the 'best' solution. A holistic policy that incentivizes innovation, provides infrastructure alternatives, and targets the largest polluters is far superior to one that simply punishes consumers. Environmental policy must balance effectiveness with social equity.",
        wordCount: 280
    },
    {
        id: 'w5',
        type: 'Task 2',
        category: 'Discussion',
        prompt: "Some people think that strict punishments for driving offenses are the key to reducing traffic accidents. Others, however, believe that other measures would be more effective. Discuss both these views and give your own opinion.",
        modelAnswer: "Ensuring traffic safety is a priority for governments worldwide. While some advocate for stringent penalties as a deterrent for driving offenses, others argue that alternative measures, such as education and infrastructure improvement, yield better results. In my opinion, a balanced approach combining strict enforcement with preventative measures is the most effective strategy.\n\nOn one hand, harsh punishments act as a significant deterrent. Fear of heavy fines, license suspension, or imprisonment can compel drivers to adhere to traffic laws more rigorously. For instance, countries with zero-tolerance policies for drink-driving, such as Sweden and Japan, often report substantially lower accident rates compared to nations with lenient penalties. When drivers know that the consequences of reckless behavior are severe and non-negotiable, they are less likely to take risks that endanger themselves and others. Therefore, punitive measures are essential for immediate compliance and for removing dangerous drivers from the roads before they cause serious harm.\n\nOn the other hand, punishment is fundamentally reactive rather than proactive. Education and infrastructure play a crucial role in preventing accidents before they occur. Better road design, such as clear signage, speed bumps in residential areas, and separated cycle lanes, reduces the likelihood of human error significantly. Similarly, mandatory defensive driving courses can equip motorists with the skills to handle hazardous situations effectively, such as emergency braking or navigating adverse weather conditions. Psychological studies suggest that positive reinforcement and skill-building often lead to longer-lasting behavioral changes than fear alone.\n\nIn conclusion, while strict punishments are necessary to enforce the rule of law and deter potential offenders, they are not a silver bullet. A comprehensive road safety strategy must also include substantial investment in safer infrastructure and ongoing driver education to address both the symptoms and the root causes of dangerous driving. Only through this multifaceted approach can societies achieve meaningful and sustained reductions in traffic accidents.",
        wordCount: 285
    }
];
