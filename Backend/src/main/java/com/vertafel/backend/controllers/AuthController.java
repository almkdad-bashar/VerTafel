package com.vertafel.backend.controllers;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.vertafel.backend.models.ERole;
import com.vertafel.backend.models.Role;
import com.vertafel.backend.models.User;
import com.vertafel.backend.payload.request.LoginRequest;
import com.vertafel.backend.payload.request.BasicRequest;
import com.vertafel.backend.payload.request.SignupRequest;
import com.vertafel.backend.payload.response.JwtResponse;
import com.vertafel.backend.payload.response.MessageResponse;
import com.vertafel.backend.repository.RoleRepository;
import com.vertafel.backend.repository.UserRepository;
import com.vertafel.backend.security.jwt.JwtUtils;
import com.vertafel.backend.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	@Autowired
	private UserRepository repository;
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

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());
//	 	todo: check if user deactivated? if yes, then prevent log in
		return ResponseEntity.ok(new JwtResponse(jwt,
												 userDetails.getId(), 
												 userDetails.getUsername(), 
												 userDetails.getEmail(), 
												 roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		String email = signUpRequest.getEmail();
		String firstname = signUpRequest.getFirstname();
		String password = encoder.encode(signUpRequest.getPassword());
		String username = signUpRequest.getUsername();
		String lastname = signUpRequest.getLastname();
		String birthDate = signUpRequest.getBirthDate();
		Integer adultNumber = signUpRequest.getAdultNumber();
		Integer childrenNumber = signUpRequest.getChildrenNumber();
		String expiryDate = signUpRequest.getExpiryDate();

		if (userRepository.existsByUsername(username)) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(email)) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}

		User user = new User();
		Set<String> strRoles = signUpRequest.getRoles();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);
					user.setUsername(username);
					user.setFirstname(firstname);
					user.setLastname(lastname);
					user.setEmail(email);
					user.setPassword(password);
					user.setBirthDate(birthDate);
					user.setRoles(roles);
					break;
				case "mod":
					Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(modRole);
					user.setUsername(username);
					user.setFirstname(firstname);
					user.setLastname(lastname);
					user.setEmail(email);
					user.setPassword(password);
					user.setBirthDate(birthDate);
					user.setRoles(roles);
					break;
				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(userRole);
					user.setUsername(username);
					user.setFirstname(firstname);
					user.setLastname(lastname);
					user.setEmail(email);
					user.setPassword(password);
					user.setBirthDate(birthDate);
					user.setAdultNumber(adultNumber);
					user.setChildrenNumber(childrenNumber);
					user.setExpiryDate(expiryDate);
					user.setRoles(roles);
				}
			});
		}

		userRepository.save(user);
		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}

	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}

	@GetMapping("/calender")
//    @PreAuthorize("hasRole('USER')")
	public ResponseEntity<String> calender(@RequestBody BasicRequest basicRequest) {
		return new ResponseEntity<String>("The reservation has being successfully booked.", HttpStatus.OK);
	}


	@GetMapping("/user")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public String userAccess() {
		return "User Content.";
	}


	@GetMapping("/mod")
	@PreAuthorize("hasRole('MODERATOR')")
	public String moderatorAccess() {
		return "Moderator Board.";
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Admin Board.";
	}


	@PostMapping("/exist")
	public ResponseEntity<?> isEmailExist(@RequestBody BasicRequest request) {
		Map<String, Object> response = new HashMap<>();
		try{
			String email = request.getJwtResponse().getEmail();
			boolean result = repository.existsByEmail(email);
			response.put("success", "The use has successfully logged out");
			return new ResponseEntity<>(response,HttpStatus.OK);
		}catch (Exception exp){
			exp.fillInStackTrace();
			response.put("error", "There is error in the input");
			return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
