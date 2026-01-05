import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/auth/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        getUser();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/auth/login");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">User Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>User ID:</strong> {user?.id}</p>
                            <p><strong>Last Sign In:</strong> {new Date(user?.last_sign_in_at).toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full" onClick={() => navigate("/esg-assessment")}>
                                Start ESG Assessment
                            </Button>
                            <Button className="w-full" variant="secondary" onClick={() => navigate("/carbon-emissions")}>
                                Go to Carbon Emissions Calculator
                            </Button>
                            <Button className="w-full" variant="outline" onClick={() => navigate("/carbon-footprint")}>
                                Go to Sector Footprint Calculator
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
