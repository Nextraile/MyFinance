<?php

namespace App\Notifications\API\V1\User\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class VerificationEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
        $data = ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())];
        $expires = now()->addMinutes(config('auth.verification.expire'))->getTimestamp();
        $backendUrl = URL::temporarySignedRoute('api.v1.auth.email.verify', $expires, $data);
        $queryParams = Str::after($backendUrl, '?');

        $frontendUrl = config('app.frontend_url') . "/verify-email/{$data['id']}/{$data['hash']}?{$queryParams}";
        
        return (new MailMessage)
            ->subject('Verify Your Email Address - ' . config('app.name'))
            ->greeting('Hello!')
            ->line('You are receiving this email because we received an email verification request for your account.')
            ->action('Verify Email', $frontendUrl)
            ->line('This verification link will expire in ' . config('auth.verification.expire') . ' minutes.')
            ->line('If you did not request an email verification, no further action is required.')
            ->salutation('Regards, ' . config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
