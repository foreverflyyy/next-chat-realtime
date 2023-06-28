interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: number;
}