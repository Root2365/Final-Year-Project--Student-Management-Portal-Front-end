package com.meinsms.backend.controllers;

import com.meinsms.backend.models.User;
import com.meinsms.backend.payload.response.MessageResponse;
import com.meinsms.backend.repository.UserRepository;
import com.meinsms.backend.security.services.UserDetailsImpl;
import com.meinsms.backend.security.services.UserDetailsServiceImpl;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
@Log4j2
public class ProfileController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/get")
    public ResponseEntity<?> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).get();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User userRequest) throws UnsupportedEncodingException, MessagingException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();

        User user = userRepository.findById(userDetails.getId()).get();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse(
                "Profile Updated Successfully", 200
        ));
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody Map<String, String> passwords) throws UnsupportedEncodingException, MessagingException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.getOne(userDetails.getId());

        if (encoder.matches(passwords.get("old_password"), user.getPassword())) {
            user.setPassword(encoder.encode(passwords.get("new_password")));
            userRepository.save(user);
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse(
                    "err_old_pass_no_match", 400
            ));
        }
        return ResponseEntity.ok(new MessageResponse(
                "succ_password_update", 200
        ));
    }
}
