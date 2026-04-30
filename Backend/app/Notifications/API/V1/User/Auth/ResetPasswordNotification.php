<?php

namespace App\Notifications\API\V1\User\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $data = ['token' => $this->token, 'email' => $notifiable->getEmailForPasswordReset()];
        $expires = now()->addMinutes(config('auth.passwords.users.expire'))->getTimestamp();
        $backendUrl = URL::temporarySignedRoute('api.v1.auth.password-resets.update', $expires, $data);
        $queryParams = Str::after($backendUrl, '?');

        $frontendUrl = config('app.frontend_url') . "/password-resets/{$data['email']}/{$data['token']}?{$queryParams}";
        
        return (new MailMessage)
            ->subject('Reset Your Password - ' . config('app.name'))
            ->greeting('Hello!')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $frontendUrl)
            ->line('This password reset link will expire in ' . config('auth.passwords.users.expire') . ' minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->salutation('Regards, ' . config('app.name'));
    }
}
