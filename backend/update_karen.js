const mongoose = require('mongoose');

const uri = "mongodb+srv://Zamani:Zamani254@cluster0.k1zxbs3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const projectId = "69a34cda0d4d59fff6ea5403";

async function updateProject() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const Project = mongoose.model('Project', new mongoose.Schema({
            metadata: Object,
            partner: Object
        }));

        const result = await Project.findByIdAndUpdate(projectId, {
            $set: {
                "metadata.partner": "Karen Hills Residences",
                "metadata.phone": "+254 755 000 000",
                "metadata.email": "sales@karenhills.co.ke",
                "partner.name": "Karen Hills Residences",
                "metadata.plotSize": "1/2 Acre",
                "metadata.county": "Nairobi",
                "metadata.isServiced": true,
                "metadata.hasUtilities": true
            }
        }, { new: true });

        console.log("Update successful:", result);
    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

updateProject();
