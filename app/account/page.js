'use client';

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Lock, AlertCircleIcon, CheckCircle } from "lucide-react";


export default function AccountPage(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPwd, setUpdatingPwd] = useState(false);
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
        setUpdatingEmail(true);
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
                setMessage('Email updated successfully.');
                setEmailForm({ newEmail: "", password: "" });
                // Reload user data
                reloadUserData();
            }
        } catch (error) {
            console.error('Error updating email:', error);
            setError('Failed to update email. Please try again.');
        } finally {
            setUpdatingEmail(false);
        }
    }

    async function updatePassword(e) {
        e.preventDefault();
        setUpdatingPwd(true);
        setError(null);
        setMessage(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            setUpdatingPwd(false);
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            setUpdatingPwd(false);
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
            setUpdatingPwd(false);
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

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account information and security settings</p>
                </div>


                {message && (
                    <Alert>
                        <CheckCircle />
                        <AlertTitle>{message}</AlertTitle>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}

                {loading ? (
                    <div className="min-h-screen p-6">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    </div>
                ) : (
                    <>
                    {/* Account Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Current username: {user.name}</p>
                            <p>Current e-mail: {user.email}</p>
                            <p>Account created: {require('moment')(user.createdAt).format('DD/MM/yyyy')}</p>
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
                                <Button type="submit" disabled={updatingEmail}>
                                    {updatingEmail ? 'Updating...' : 'Update Email'}
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
                                <Button type="submit" disabled={updatingPwd}>
                                    {updatingPwd ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Separator />

                    <Button 
                        variant="destructive" 
                        onClick={signOut}
                        className="w-full sm:w-auto"
                    >
                        Sign Out
                    </Button>
                    </>
                )}

            </div>
        </div>
    );
}