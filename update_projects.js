const fs = require('fs');
const path = 'C:/Users/Brian/Desktop/Zamani/Zamani/app/(tabs)/projects.tsx';
let data = fs.readFileSync(path, 'utf8');

const startIdx = data.indexOf('    const allProjects = [');
if (startIdx === -1) {
    console.log("Could not find start");
    process.exit(1);
}

const endStr = '\n    const filteredProjects = ';
let endIdx = data.indexOf(endStr, startIdx);
if (endIdx === -1) {
    console.log("Could not find end");
    process.exit(1);
}

const replacement = `    const [allProjects, setAllProjects] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { API_URL } = require('../config/authService');
                const response = await fetch(\`\${API_URL}/projects\`);
                const data = await response.json();
                
                const formatted = data.map((item: any) => ({
                    ...item,
                    ...item.metadata,
                    priceNum: item.targetAmount || parseInt(item.price?.replace(/[^0-9]/g, '') || '0'),
                    type: item.subCategory || item.metadata?.propertyType || item.metadata?.source || item.category,
                    features: {
                        nearTarmac: item.metadata?.isNearTarmac,
                        utilities: item.metadata?.hasUtilities,
                        serviced: item.metadata?.isServiced
                    }
                }));
                // set oldest or newest first? The api does -1 sort on createdAt (newest first). Let's use it.
                setAllProjects(formatted);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            }
        };
        fetchProjects();
    }, []);
`;

const newCode = data.substring(0, startIdx) + replacement + '    const filteredProjects = ' + data.substring(data.indexOf('allProjects.filter(p => {', endIdx));
fs.writeFileSync(path, newCode, 'utf8');
console.log("Done");
