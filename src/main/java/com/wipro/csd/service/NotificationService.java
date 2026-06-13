package com.wipro.csd.service;

import com.wipro.csd.dto.ApiResponse;
import com.wipro.csd.model.Notification;
import com.wipro.csd.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notifRepo;

    public Notification create(Long userId, String message, String type) {
        return notifRepo.save(Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build());
    }

    public List<Notification> getForUser(Long userId) {
        return notifRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notifRepo.countByUserIdAndReadFalse(userId);
    }

    public ApiResponse markRead(Long id) {
        notifRepo.findById(id).ifPresent(n -> {
            n.setRead(true);
            notifRepo.save(n);
        });
        return new ApiResponse(true, "Marked as read");
    }

    @Transactional
    public ApiResponse clearRead(Long userId) {
        notifRepo.deleteByUserIdAndReadTrue(userId);
        return new ApiResponse(true, "Cleared");
    }
}
