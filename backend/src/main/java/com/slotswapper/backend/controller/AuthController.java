package com.slotswapper.backend.controller;

import com.slotswapper.backend.dto.AuthResponse;
import com.slotswapper.backend.dto.LoginRequest;
import com.slotswapper.backend.dto.SignUpRequest;
import com.slotswapper.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Account Creation Controller
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        String token = authService.signUp(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    // Account Login Controller
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}