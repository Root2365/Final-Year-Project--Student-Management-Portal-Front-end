package com.meinsms.backend.controllers;

import com.meinsms.backend.models.ERole;
import com.meinsms.backend.models.Role;
import com.meinsms.backend.models.User;
import com.meinsms.backend.payload.request.LoginRequest;
import com.meinsms.backend.payload.request.SignupRequest;
import com.meinsms.backend.payload.response.CommonResponse;
import com.meinsms.backend.payload.response.JwtResponse;
import com.meinsms.backend.payload.response.MessageResponse;
import com.meinsms.backend.repository.RoleRepository;
import com.meinsms.backend.repository.UserRepository;
import com.meinsms.backend.security.jwt.JwtUtils;
import com.meinsms.backend.security.services.UserDetailsImpl;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private String url = "http://localhost:4200";

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new CommonResponse(true, "logged_successful", new JwtResponse(jwt,
                        userDetails.getId(),
                        userDetails.getName(),
                        userDetails.getUsername(),
                        roles)));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new CommonResponse(false, "username_taken", null));
            }

            User user = new User();
            user.setName(signUpRequest.getName());
            user.setUsername(signUpRequest.getUsername());
            user.setPassword(encoder.encode(signUpRequest.getPassword()));
            user.setType(signUpRequest.getType());
            user.setEmail(signUpRequest.getEmail());
            user.setPhone(signUpRequest.getPhone());

            Set<String> strRoles = signUpRequest.getRole();
            Set<Role> roles = new HashSet<>();

            if (strRoles == null) {
                Role userRole = roleRepository.findByName(ERole.ROLE_PARENT)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "super_admin":
                            Role adminRole = roleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(adminRole);
                            break;
                        case "admin":
                            Role modRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(modRole);
                            break;

                        case "teacher":
                            Role teacherRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(teacherRole);
                            break;

                        default:
                            Role parentRole = roleRepository.findByName(ERole.ROLE_PARENT)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(parentRole);
                            break;
                    }
                });
            }

            user.setRoles(roles);
            userRepository.save(user);

            return ResponseEntity.ok(new CommonResponse(true, "regis_successful", null));
        } catch (Exception e) {
            return ResponseEntity.ok(new CommonResponse(false, "regis_unsuccessful", e.getMessage()));
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.add(fieldName + " " + errorMessage);
        });
        return ResponseEntity.ok(new CommonResponse(false, "bad_request", null, errors));
    }

    @PostMapping("/reset")
    private void sendResetLink(@Valid @RequestBody Map<String, String> param) throws MessagingException, UnsupportedEncodingException {
        String toAddress = param.get("email");
        Optional<User> user = userRepository.findByEmail(param.get("email"));

        if (user.isPresent()) {
            user.get().setPassword_token(RandomString.make(64));
            userRepository.save(user.get());

            String fromAddress = "noreply.li@gmail.com";
            String senderName = "Student Managemnt";
            String subject = "Reset";
            String content = "Dear [[name]],<br>"
                    + "Hello,<br><br>"
                    + "To reset password :<br>"
                    + "<h3><a href=\"[[URL]]\" target=\"_self\">Reset Password</a></h3><br>";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setFrom(fromAddress, senderName);
            helper.setTo(toAddress);
            helper.setSubject(subject);

            content = content.replace("[[name]]", user.get().getName());
            String verifyURL = url + "/#/authentication/reset?token=" + user.get().getPassword_token();

            content = content.replace("[[URL]]", verifyURL);
            helper.setText(content, true);
            mailSender.send(message);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody Map<String, String> passwords) throws UnsupportedEncodingException, MessagingException {
        User user = userRepository.findByPassResetToken(passwords.get("token"));
        if (user != null) {
            user.setPassword(encoder.encode(passwords.get("new_password")));
            user.setPassword_token(null);
            userRepository.save(user);
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Password Update Failed !!!", 400));
        }
        return ResponseEntity.ok(new MessageResponse("Password Update Successful", 200));
    }
}
