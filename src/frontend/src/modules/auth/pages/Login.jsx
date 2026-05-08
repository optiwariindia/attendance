import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";

import { api } from "../../../shared/utils";

export default function Login() {
    const [navigate] = [
        useNavigate()
    ]
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError("Username and password are required");
            e.target.querySelectorAll("[name]").forEach(
                input => input.addEventListener("focus", () => {
                    setError("")
                })
            )
            return;
        }
        let resp = await api.post(`/api/v1/login`, form);
        if (resp.status === "error") {
            setError(resp.message);
            e.target.querySelectorAll("[name]").forEach(
                input => input.addEventListener("focus", () => {
                    setError("")
                })
            )
            return;
        }
        if ("token" in resp) {
            localStorage.setItem("token", resp.token);

            navigate(0);
            return;
        }
        setError(resp.message);
        e.target.querySelectorAll("[name]").forEach(
            input => input.addEventListener("focus", () => {
                setError("")
            })
        )
        return;

    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={ { minHeight: "100vh", backgroundImage: "url('/background.webp')", backgroundSize: "cover", backgroundPosition: "center" } }
        >
            <Grid
                size={ { xs: 11, md: 8, lg: 4 } }
                sx={ { p: 3, border: "1px solid #ccc", borderRadius: 2 } }
                bgcolor="white"
            >
                <h1 style={ { textAlign: "center", marginBottom: "20px" } }>Login</h1>

                <form onSubmit={ handleSubmit }>
                    <TextField
                        label="E Mail / Employee ID"
                        name="username"
                        value={ form.username }
                        onChange={ handleChange }
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Password"
                        name="password"
                        value={ form.password }
                        onChange={ handleChange }
                        variant="outlined"
                        type={ showPassword ? "text" : "password" }
                        fullWidth
                        margin="normal"
                        InputProps={ {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ () => setShowPassword((prev) => !prev) }
                                        edge="end"
                                        sx={ { mr: 0 } }
                                    >
                                        { showPassword ? <VisibilityOff /> : <Visibility /> }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        } }
                    />

                    { error && (
                        <Typography variant="body2" color="error" sx={ { mt: 2 } }>
                            { error }
                        </Typography>
                    ) }

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        sx={ { mt: 3, mb: 5, fontWeight: 600 } }
                    >
                        Login
                    </Button>
                </form>
            </Grid>
        </Grid>
    );
}
