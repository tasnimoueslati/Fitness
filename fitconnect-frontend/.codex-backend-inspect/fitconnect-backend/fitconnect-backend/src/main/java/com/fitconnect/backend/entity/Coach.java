package com.fitconnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ElementCollection
    @CollectionTable(name = "coach_specialites", joinColumns = @JoinColumn(name = "coach_id"))
    @Column(name = "specialite")
    @Builder.Default
    private List<String> specialites = new ArrayList<>();

    @Column(length = 2000)
    private String bio;

    private String diplomes;

    private BigDecimal tarifSeance;

    @Builder.Default
    private Double noteMoyenne = 0.0;

    @Builder.Default
    private Integer nombreAvis = 0;

    @OneToMany(mappedBy = "coach", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Availability> disponibilites = new ArrayList<>();
}
