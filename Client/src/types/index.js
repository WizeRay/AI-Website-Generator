// User
const user = {
    id: "",
    email: "",
    fullName: "",
    imageUrl: "",
    name: "",
    image: ""
};

// Message
const message = {
    id: "",
    role: null,
    content: "",
    timestamp: ""
};

// Version
const version = {
    id: "",
    timestamp: "",
    code: ""
};

// Project
const project = {
    id: "",
    name: "",
    initial_prompt: "",
    current_code: "",
    createdAt: "",
    updatedAt: "",
    userId: "",
    user: null,
    isPublished: false,
    versionId: "",
    conversation: [],
    versions: [],
    current_version_index: ""
};