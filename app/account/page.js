'use client'

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Lock, AlertTriangle, CheckCircle } from "lucide-react";

export default function AccountPage(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    
    const [emailForm, setEmailForm] = useState({
        newEmail: "",
        password: ""
    });
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const router = useRouter();

    useEffect(() => {
        async function loadUserData() {
            try {
                const { data: session } = await authClient.getSession();
                if (!session) {
                    router.push('/login');
                    return;
                }
                setUser(session.user);
            } catch (error) {
                console.error('Error loading user data:', error);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        }
        
        loadUserData();
    }, [router]);

    // Remove the standalone loadUserData function and create a new one for reloading
    async function reloadUserData() {
        try {
            const { data: session } = await authClient.getSession();
            if (session) {
                setUser(session.user);
            }
        } catch (error) {
            console.error('Error reloading user data:', error);
        }
    }

    async function updateEmail(e) {
        e.preventDefault();
        setUpdating(true);
        setError(null);
        setMessage(null);

        try {
            const result = await authClient.changeEmail({
                newEmail: emailForm.newEmail,
                password: emailForm.password
            });

            if (result.error) {
                setError(result.error.message || 'Failed to update email');
            } else {
                setMessage('Email updated successfully. Please check your new email for verification.');
                setEmailForm({ newEmail: "", password: "" });
                // Reload user data
                reloadUserData();
            }
        } catch (error) {
            console.error('Error updating email:', error);
            setError('Failed to update email. Please try again.');
        } finally {
            setUpdating(false);
        }
    }

    async function updatePassword(e) {
        e.preventDefault();
        setUpdating(true);
        setError(null);
        setMessage(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            setUpdating(false);
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            setUpdating(false);
            return;
        }

        try {
            const result = await authClient.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (result.error) {
                setError(result.error.message || 'Failed to update password');
            } else {
                setMessage('Password updated successfully');
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setError('Failed to update password. Please try again.');
        } finally {
            setUpdating(false);
        }
    }

    async function signOut() {
        try {
            await authClient.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account information and security settings</p>
                </div>

                {message && (
                    <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* User Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>Your basic account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Name</Label>
                                <p className="text-sm text-muted-foreground">{user?.name || 'Not set'}</p>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        {user?.emailVerified && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                Email verified
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Email Change */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Change Email
                        </CardTitle>
                        <CardDescription>Update your email address</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={updateEmail} className="space-y-4">
                            <div>
                                <Label htmlFor="newEmail">New Email</Label>
                                <Input
                                    id="newEmail"
                                    type="email"
                                    value={emailForm.newEmail}
                                    onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})}
                                    placeholder="Enter new email address"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="emailPassword">Current Password</Label>
                                <Input
                                    id="emailPassword"
                                    type="password"
                                    value={emailForm.password}
                                    onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                                    placeholder="Enter your current password"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={updating}>
                                {updating ? 'Updating...' : 'Update Email'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Change */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Change Password
                        </CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={updatePassword} className="space-y-4">
                            <div>
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    placeholder="Enter your current password"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    placeholder="Enter new password (min. 8 characters)"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    placeholder="Confirm your new password"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <Button type="submit" disabled={updating}>
                                {updating ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Separator />

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>These actions cannot be undone</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            variant="destructive" 
                            onClick={signOut}
                            className="w-full sm:w-auto"
                        >
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}