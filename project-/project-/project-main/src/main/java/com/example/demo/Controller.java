package com.example.demo;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://127.0.0.1:5500/index.html")
@RestController
@RequestMapping("/bibliotech")

public class Controller {

	@Autowired
	private Repository repository;

	@GetMapping
	public ResponseEntity<?> getAllModels() {
		return ResponseEntity.ok(repository.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Model> getModelById(@PathVariable("id") long id) {
		Optional<Model> model = repository.findById(id);
		return model.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Model> createModel(@RequestBody Dto d) {
		System.out.println("CHEGOU");
		Model savedModel = new Model(d);
		repository.save(savedModel);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedModel);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> atualizarUsuario(@PathVariable long id, @RequestBody Dto dt) {
		Model us = repository.findById(id).orElse(null);
		if (us == null){
			return ResponseEntity.notFound().build();
		}
		us.updateDTO(dt);// Atualiza o modelo com os dados do DTO
		repository.save(us);
		return ResponseEntity.ok("Atualizado com sucesso");
	}


	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteModel(@PathVariable("id") long id) {
		if (!repository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
