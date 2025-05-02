
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlasticDetection } from "@/services/geminiService";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Info, Recycle, Package, Trash2, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

interface PlasticInfoProps {
  detections: PlasticDetection[];
  nonPlasticDetected?: boolean;
}

const getPlasticInfo = (plasticType: string) => {
  const info: Record<string, { 
    description: string, 
    recyclable: boolean, 
    uses: string[], 
    tips: string[],
    recycling_methods: string[],
    environmental_impact: string,
    alternatives: string[],
    recycling_preparation: string[],
    recycling_facilities: string[],
    recycling_challenges: string[],
    recycling_facts: string[]
  }> = {
    "PET": {
      description: "Polyethylene Terephthalate - Clear, strong, and lightweight plastic commonly used for beverage bottles.",
      recyclable: true,
      uses: ["Water bottles", "Soft drink bottles", "Food containers", "Polyester fibers"],
      tips: [
        "Rinse containers before recycling",
        "Remove caps and labels if possible",
        "Flatten to save space in recycling bin",
        "Avoid heat exposure as it may release antimony"
      ],
      recycling_methods: [
        "Mechanical recycling into new bottles and containers",
        "Shredding and conversion into polyester fibers for clothing and carpets",
        "Processing into food-grade packaging through approved methods"
      ],
      environmental_impact: "While recyclable, PET can take hundreds of years to decompose in landfills and may release microplastics into the environment.",
      alternatives: ["Glass containers", "Aluminum containers", "Reusable water bottles"],
      recycling_preparation: [
        "Remove all liquid contents",
        "Clean the inside with water to remove residues",
        "Remove plastic caps and place them separately in recycling (they're often a different plastic type)",
        "Keep bottles intact - don't crush them as it makes sorting more difficult"
      ],
      recycling_facilities: [
        "Municipal recycling programs (curbside pickup)",
        "Recycling drop-off centers",
        "Bottle deposit programs in some regions",
        "Specialized plastic recycling facilities"
      ],
      recycling_challenges: [
        "Colored PET is harder to recycle than clear",
        "Food contamination can make recycling difficult",
        "Labels and adhesives can complicate the process",
        "Mixed plastic types reduce recycling efficiency"
      ],
      recycling_facts: [
        "It takes 2/3 less energy to produce products from recycled PET compared to virgin materials",
        "One ton of recycled PET saves approximately 1-2 tons of CO2 emissions",
        "PET can be recycled multiple times before its quality degrades significantly",
        "In the U.S., only about 29% of PET bottles are currently recycled"
      ]
    },
    "HDPE": {
      description: "High-Density Polyethylene - Stiff, strong plastic resistant to many solvents, with good moisture barrier.",
      recyclable: true,
      uses: ["Milk jugs", "Detergent bottles", "Toys", "Plastic lumber"],
      tips: [
        "Rinse thoroughly before recycling",
        "Remove paper labels when possible",
        "Keep caps on for better processing",
        "Safe for food storage"
      ],
      recycling_methods: [
        "Mechanical recycling into new containers",
        "Conversion into plastic lumber for outdoor furniture and decking",
        "Processing into pipes, playground equipment, and trash cans"
      ],
      environmental_impact: "One of the more easily recycled plastics, but still persists in the environment for decades to centuries if not properly disposed of.",
      alternatives: ["Glass containers", "Cardboard containers", "Reusable silicone containers"],
      recycling_preparation: [
        "Empty all contents completely",
        "Rinse out detergent or food residues",
        "Leave caps on bottles (in most municipalities)",
        "Flatten containers slightly to save space, but don't crush completely"
      ],
      recycling_facilities: [
        "Curbside recycling programs",
        "Community recycling centers",
        "Plastic bag collection points (for HDPE film)",
        "Commercial recyclers"
      ],
      recycling_challenges: [
        "Different colors of HDPE may need to be separated",
        "Chemical residues can contaminate recycling batches",
        "Multi-layer or composite HDPE products are difficult to recycle",
        "Low market value can make collection economically challenging"
      ],
      recycling_facts: [
        "HDPE is one of the most widely recycled plastics globally",
        "Recycling one ton of HDPE saves approximately 5,774 kWh of electricity",
        "HDPE can be recycled into drainage pipes, flower pots, and even plastic lumber",
        "It takes just 25% of the energy to produce recycled HDPE compared to virgin material"
      ]
    },
    "PVC": {
      description: "Polyvinyl Chloride - Versatile plastic used for both rigid and flexible applications, contains chlorine.",
      recyclable: false,
      uses: ["Pipes", "Shower curtains", "Window frames", "Medical equipment"],
      tips: [
        "Avoid burning as it releases toxic chemicals",
        "Check with specialized recycling facilities",
        "Keep separate from other recyclables",
        "Consider alternatives when possible"
      ],
      recycling_methods: [
        "Specialized mechanical recycling (limited availability)",
        "Conversion into floor mats, pipes, or traffic cones through specific programs",
        "Chemical recycling in advanced facilities (not widely available)"
      ],
      environmental_impact: "Contains chlorine and potentially harmful additives like phthalates. Can leach chemicals and is difficult to recycle.",
      alternatives: ["HDPE or PP pipes", "Cotton shower curtains", "Wooden window frames"],
      recycling_preparation: [
        "Identify PVC items carefully - they often have a '3' recycling code",
        "Separate from other plastics to avoid contaminating recyclable streams",
        "Check with local waste management about special collection options",
        "Consider reuse options before disposal"
      ],
      recycling_facilities: [
        "Specialized PVC recyclers (not common in residential systems)",
        "Construction waste recycling facilities (for pipes and building materials)",
        "Industrial waste management companies",
        "Some manufacturer take-back programs"
      ],
      recycling_challenges: [
        "Contains chlorine which creates toxic compounds when processed",
        "Various additives make uniform recycling difficult",
        "Low demand for recycled PVC material",
        "High separation and processing costs"
      ],
      recycling_facts: [
        "PVC can release harmful dioxins when incinerated",
        "While technically recyclable, PVC has one of the lowest recycling rates of common plastics",
        "Recycling post-industrial PVC scrap is more common than post-consumer recycling",
        "PVC window frames can be recycled up to 8 times"
      ]
    },
    "LDPE": {
      description: "Low-Density Polyethylene - Flexible, transparent plastic with good moisture barrier properties.",
      recyclable: true,
      uses: ["Plastic bags", "Squeezable bottles", "Food wrap", "Flexible container lids"],
      tips: [
        "Collect multiple bags together for recycling",
        "Take to store drop-off locations",
        "Reuse when possible before recycling",
        "Keep clean and dry"
      ],
      recycling_methods: [
        "Conversion into plastic lumber and outdoor furniture",
        "Processing into plastic bags, trash can liners, and packaging materials",
        "Transformation into playground equipment and plastic shipping pallets"
      ],
      environmental_impact: "Lightweight and can easily become windborne litter. Creates problems for marine life and wildlife when improperly disposed of.",
      alternatives: ["Reusable fabric bags", "Paper bags", "Beeswax wraps", "Silicone lids"],
      recycling_preparation: [
        "Clean and dry all LDPE materials",
        "Bundle plastic bags and film together",
        "Remove paper receipts, labels, and tape",
        "Check for food contamination and discard if dirty"
      ],
      recycling_facilities: [
        "Grocery store collection bins (for bags and film)",
        "Specialized plastic film recyclers",
        "Some curbside programs (check local guidelines)",
        "Mail-back programs for certain LDPE products"
      ],
      recycling_challenges: [
        "Often gets tangled in recycling machinery",
        "Light weight makes collection and transportation inefficient",
        "Frequently contaminated with food or other materials",
        "Low economic value compared to other plastics"
      ],
      recycling_facts: [
        "500 billion to 1 trillion plastic bags are used worldwide annually",
        "Recycled LDPE can save 70% of the energy required to make virgin LDPE",
        "Most recycled LDPE is turned into composite lumber products",
        "It takes about 1,000 years for a plastic bag to degrade in a landfill"
      ]
    },
    "PP": {
      description: "Polypropylene - Tough, heat-resistant plastic with good chemical resistance and barrier properties.",
      recyclable: true,
      uses: ["Yogurt containers", "Medicine bottles", "Bottle caps", "Automotive parts"],
      tips: [
        "Clean thoroughly before recycling",
        "Check local recycling guidelines for caps",
        "Safe for microwave use",
        "Can withstand high temperatures"
      ],
      recycling_methods: [
        "Mechanical recycling into plastic parts and containers",
        "Conversion into automotive parts, battery cases, and brushes",
        "Processing into storage containers and durable goods"
      ],
      environmental_impact: "More resistant to heat and chemicals than some other plastics, which can make it more durable but also persistent in the environment.",
      alternatives: ["Glass containers", "Metal containers", "Silicone containers for food storage"],
      recycling_preparation: [
        "Remove food residues and rinse containers",
        "Separate lids and containers if they're different plastic types",
        "Stack similar items together for efficient collection",
        "Check if local program accepts PP (increasingly common)"
      ],
      recycling_facilities: [
        "Municipal recycling programs",
        "Material recovery facilities (MRFs)",
        "Specialized plastic recyclers",
        "TerraCycle programs for hard-to-recycle PP items"
      ],
      recycling_challenges: [
        "Often mixed with other plastics in products",
        "Food contamination can complicate recycling",
        "Black PP is difficult for sorting machines to detect",
        "Some PP products contain additives that complicate recycling"
      ],
      recycling_facts: [
        "PP is increasingly accepted in curbside recycling programs",
        "Recycling PP uses 88% less energy than producing it from raw materials",
        "PP can be recycled multiple times before quality degradation",
        "PP recycling rates are improving as technology advances"
      ]
    },
    "PS": {
      description: "Polystyrene - Lightweight plastic that can be rigid or foamed (Styrofoam), poor heat resistance.",
      recyclable: false,
      uses: ["Foam cups", "Food containers", "Packaging materials", "Insulation"],
      tips: [
        "Avoid with hot foods and liquids",
        "Look for specialized recycling programs",
        "Consider alternatives when possible",
        "Cannot be recycled in most curbside programs"
      ],
      recycling_methods: [
        "Specialized collection for foam packaging (limited availability)",
        "Processing into insulation, rulers, and picture frames in specialized facilities",
        "Densification for transportation to recycling centers"
      ],
      environmental_impact: "Breaks down into small pieces easily, creating microplastics. Commonly found as litter and in marine environments. Can leach styrene when heated.",
      alternatives: ["Paper cups and plates", "Cardboard packaging", "Reusable containers", "Biodegradable packaging"],
      recycling_preparation: [
        "Remove all stickers, labels and food residue",
        "Separate foam PS (Styrofoam) from rigid PS",
        "Call ahead to check if facilities accept PS",
        "Consider mail-back programs for foam packaging"
      ],
      recycling_facilities: [
        "Specialized foam recycling centers (limited locations)",
        "Some mail-back programs from manufacturers",
        "Dart Container drop-off locations (for foam)",
        "Commercial densifiers at waste management facilities"
      ],
      recycling_challenges: [
        "Very lightweight, making transportation costly",
        "Often contaminated with food waste",
        "Low market value for recycled material",
        "Many facilities lack technology to process it efficiently"
      ],
      recycling_facts: [
        "PS makes up about 30% of landfill material by volume",
        "Recycling rates for PS are among the lowest of all plastics (less than 1% in many regions)",
        "PS can be recycled into insulation, coat hangers, and office supplies",
        "When recycled, PS uses 90% less energy than producing from virgin materials"
      ]
    },
    "Others": {
      description: "Various other plastic types or combinations of plastics not easily categorized.",
      recyclable: false,
      uses: ["Water filters", "Multi-layer packaging", "Specialty products", "Medical devices"],
      tips: [
        "Check with manufacturer for disposal guidelines",
        "Not typically recyclable in standard programs",
        "May require special handling",
        "Consider alternatives when available"
      ],
      recycling_methods: [
        "Typically not recyclable through conventional means",
        "May be processed through specialized chemical recycling (limited availability)",
        "Some terracycle programs accept specific mixed plastic products"
      ],
      environmental_impact: "Often contains multiple materials or additives that make recycling difficult or impossible through standard methods.",
      alternatives: ["Look for products in more easily recycled packaging (PET, HDPE, etc.)", "Products with minimal packaging"],
      recycling_preparation: [
        "Research the specific type of plastic if possible (check manufacturer website)",
        "Contact the manufacturer for take-back programs",
        "Check specialized recycling programs like TerraCycle",
        "Separate from mainstream recycling to avoid contamination"
      ],
      recycling_facilities: [
        "Manufacturer take-back programs",
        "Specialized mail-in recycling programs",
        "TerraCycle and other specialty recyclers",
        "Advanced chemical recycling facilities (emerging technology)"
      ],
      recycling_challenges: [
        "Multi-layer materials are difficult to separate",
        "Often contain combinations of different plastic types",
        "Specialized equipment needed for processing",
        "Limited economic incentive for recyclers"
      ],
      recycling_facts: [
        "Category 7 (Other) plastics are among the fastest-growing segments of plastic waste",
        "Chemical recycling technologies are being developed to better handle these materials",
        "Some bioplastics fall into this category but require specialized composting facilities",
        "Extended producer responsibility programs are emerging to address these hard-to-recycle items"
      ]
    },
    "Unknown": {
      description: "Plastic type could not be identified with confidence.",
      recyclable: false,
      uses: ["Various applications"],
      tips: [
        "Consult with local recycling experts",
        "Check for recycling symbols on the item",
        "When in doubt, throw it out to avoid contaminating recycling streams",
        "Consider reuse options"
      ],
      recycling_methods: [
        "Depends on actual plastic type - verification needed",
        "Not recommended for recycling unless plastic type can be confirmed",
        "Check with specialized recycling facilities"
      ],
      environmental_impact: "Unknown without determining the specific plastic type, but all plastics persist in the environment for long periods.",
      alternatives: ["Products with clearly labeled recyclable packaging"],
      recycling_preparation: [
        "Look for recycling codes (numbers 1-7 in a triangle) on the item",
        "Contact your local recycling facility for guidance",
        "Consider reuse options if recycling isn't possible",
        "As a last resort, dispose in regular waste"
      ],
      recycling_facilities: [
        "Local waste management authority can provide guidance",
        "Waste characterization services (often available for businesses)",
        "University or research labs may help identify materials",
        "Photography or spectroscopy can help identify unknown plastics"
      ],
      recycling_challenges: [
        "Without identification, proper recycling stream can't be determined",
        "Risk of contaminating other recyclables",
        "Processing facilities typically reject unidentified materials",
        "May contain additives or composites that complicate recycling"
      ],
      recycling_facts: [
        "About 25% of plastic collected for recycling is rejected due to contamination or misidentification",
        "Technology for automated plastic identification is improving rapidly",
        "Some regions have adopted NIR (Near-Infrared) scanning to identify plastic types",
        "When in doubt, leaving an item out of recycling is often better than risking contamination"
      ]
    }
  };

  // Handle cases where the label might include variations
  let key = "Unknown";
  Object.keys(info).forEach(k => {
    if (plasticType.includes(k)) {
      key = k;
    }
  });

  return info[key] || info["Unknown"];
};

const PlasticInfo = ({ detections, nonPlasticDetected = false }: PlasticInfoProps) => {
  if (detections.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            No Plastic Items Detected
          </CardTitle>
          <CardDescription>
            {nonPlasticDetected 
              ? "Non-plastic materials were detected in the image."
              : "No materials were confidently identified in the image."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
            <p className="text-sm text-amber-800">
              Try uploading a clearer image containing plastic waste items. The AI works best with well-lit images where plastic items are clearly visible.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group detections by plastic type
  type PlasticGroup = {
    type: string;
    count: number;
    items: Array<{detection: PlasticDetection, index: number}>;
  };
  
  const plasticGroups: Record<string, PlasticGroup> = {};
  
  detections.forEach((detection, index) => {
    const type = detection.label;
    if (!plasticGroups[type]) {
      plasticGroups[type] = { type, count: 0, items: [] };
    }
    plasticGroups[type].count++;
    plasticGroups[type].items.push({ detection, index });
  });

  // Sort plastic types by count (descending)
  const sortedPlasticGroups = Object.values(plasticGroups).sort(
    (a, b) => b.count - a.count
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-6 w-6 text-eco-green-medium" />
          Detected Plastics
        </CardTitle>
        <CardDescription>
          {detections.length} plastic item{detections.length !== 1 ? 's' : ''} detected
          {nonPlasticDetected && " (non-plastic materials also present)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedPlasticGroups.map((group, groupIndex) => {
          const info = getPlasticInfo(group.type);
          return (
            <div key={group.type} className={`rounded-lg border ${info.recyclable ? 'border-green-100 bg-green-50' : 'border-amber-100 bg-amber-50'} overflow-hidden`}>
              {groupIndex > 0 && <div className="mb-4"></div>}
              <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {group.type}
                  </h3>
                  <Badge variant={info.recyclable ? "default" : "destructive"} className="ml-2">
                    {group.count} item{group.count !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-sm mt-1 text-slate-200">{info.description}</p>
              </div>
              
              {/* List of detected items with this plastic type */}
              <div className="p-4">
                <p className="text-sm font-medium flex items-center gap-1 mb-2">
                  <Info className="h-4 w-4" />
                  Detected Items:
                </p>
                <ul className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {group.items.map(({detection, index}) => (
                    <li key={index} className="flex items-center bg-white/60 p-2 rounded-md border">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full mr-2 text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>
                        {detection.item_description || `${detection.label} item`} 
                        <span className="text-xs text-muted-foreground ml-1">
                          ({Math.round(detection.confidence * 100)}% confidence)
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1 mb-1">
                        <Package className="h-4 w-4" />
                        Common Uses
                      </p>
                      <ul className="text-sm list-disc pl-4 mt-1 space-y-1">
                        {info.uses.map((use, i) => (
                          <li key={i}>{use}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium flex items-center gap-1 mb-1">
                        <Recycle className="h-4 w-4" />
                        Recycling Status
                      </p>
                      <div className="flex items-center mt-1 p-2 rounded-md bg-white/60">
                        <div className={`w-3 h-3 rounded-full mr-2 ${info.recyclable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium">{info.recyclable ? 'Recyclable' : 'Difficult to recycle'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1 mb-1">
                        <Info className="h-4 w-4" />
                        Recycling Tips
                      </p>
                      <ul className="text-sm list-disc pl-4 mt-1 space-y-1">
                        {info.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-2 bg-white/80 rounded-md border text-sm font-medium">
                    <div className="flex items-center">
                      <Recycle className="h-4 w-4 mr-2" />
                      Detailed Recycling Information
                    </div>
                    <span className="text-xs text-muted-foreground">Click to expand</span>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2 space-y-4">
                    <div className="bg-white/60 rounded-md border p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Box className="h-4 w-4 mr-2" />
                        Recycling Methods
                      </h4>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {info.recycling_methods.map((method, i) => (
                          <li key={i}>{method}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/60 rounded-md border p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Recycle className="h-4 w-4 mr-2" />
                        How to Prepare for Recycling
                      </h4>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {info.recycling_preparation.map((prep, i) => (
                          <li key={i}>{prep}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/60 rounded-md border p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Where to Recycle
                      </h4>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {info.recycling_facilities.map((facility, i) => (
                          <li key={i}>{facility}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/60 rounded-md border p-3">
                      <h4 className="text-sm font-medium mb-2">Recycling Challenges</h4>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {info.recycling_challenges.map((challenge, i) => (
                          <li key={i}>{challenge}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/60 rounded-md border p-3">
                      <h4 className="text-sm font-medium mb-2">Did You Know?</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Recycling Facts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {info.recycling_facts.map((fact, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{i + 1}</TableCell>
                              <TableCell>{fact}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Environmental Impact</p>
                  <p className="text-sm bg-white/60 p-2 rounded-md border">{info.environmental_impact}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Better Alternatives</p>
                  <div className="flex flex-wrap gap-2">
                    {info.alternatives.map((alt, i) => (
                      <Badge key={i} variant="outline" className="bg-white/60">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PlasticInfo;
