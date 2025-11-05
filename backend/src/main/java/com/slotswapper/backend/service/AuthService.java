package com.slotswapper.backend.service;


import com.slotswapper.backend.dto.LoginRequest;
import com.slotswapper.backend.dto.SignUpRequest;
import com.slotswapper.backend.model.User;
import com.slotswapper.backend.repository.UserAuthRepository;
import com.slotswapper.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserAuthRepository userAuthRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;


    @Autowired
    private JwtUtils jwtUtils;


    public String signUp(SignUpRequest request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userAuthRepository.save(user);


        String token = jwtUtils.getToken(request.getEmail());

        return token;
    }

    /**
     * Handles User Log In.
     */
    public String login(LoginRequest request) {

        // This will check the email and (hashed) password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        User user = userAuthRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3. Generate a JWT token for them
        String token = jwtUtils.getToken(request.getEmail());

        return token;
    }
}