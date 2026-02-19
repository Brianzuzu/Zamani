import { Redirect } from "expo-router";

export default function Index() {
    // Check if user is logged in (mock check)
    // In a real app, this would check a token in storage or a context state
    const isLoggedIn = false;

    if (isLoggedIn) {
        return <Redirect href="/home" />;
    }

    return <Redirect href="/login" />;
}
