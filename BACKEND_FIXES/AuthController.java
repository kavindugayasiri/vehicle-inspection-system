package com.vehicleinspection.controller;

import com.vehicleinspection.dto.request.LoginRequest;
import com.vehicleinspection.dto.request.RegisterRequest;
import com.vehicleinspection.dto.response.ApiResponse;
import com.vehicleinspection.dto.response.AuthResponse;
import com.vehicleinspection.model.Role;
import com.vehicleinspection.model.User;
import com.vehicleinspection.repository.UserRepository;
import com.vehicleinspection.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Email is already registered!"));
        }

        User user = User.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .role(Role.valueOf(request.getRole().toUpperCase()))
            .build();

        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Invalid email or password!"));
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(
            token,
            user.getEmail(),
            user.getRole().name(),
            user.getFullName()
        ));
    }
}
