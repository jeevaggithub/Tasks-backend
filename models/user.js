//define the schema

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Array of task IDs
}, { collection: 'users' });

// Create a user model
const User = mongoose.model('User', userSchema);