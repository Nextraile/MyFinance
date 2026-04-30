<?php

namespace App\Notifications\API\V1\User\Auth\Verified;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class NewDeviceLoginDetectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $hash)
    {
        $this->hash = $hash;
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
        $data = ['email' => $notifiable->getEmailForVerification(), 'hash' => $this->hash];
        $expires = now()->addMinutes(config('auth.verification.expire'))->getTimestamp();
        $backendUrl = URL::temporarySignedRoute('api.v1.auth.login.new-device', $expires, $data);
        $queryParams = Str::after($backendUrl, '?');
        
        $frontendUrl = config('app.frontend_url') . "/new-location/{$data['email']}/{$data['hash']}?{$queryParams}";
        
        return (new MailMessage)
            ->subject('Verify Your New Device - ' . config('app.name'))
            ->greeting('Hello!')
            ->line('You are receiving this email because we received a new device login request for your account.')
            ->action('Verify Device', $frontendUrl)
            ->line('This verification link will expire in ' . config('auth.verification.expire') . ' minutes.')
            ->line('If you did not request a new device login, no further action is required.')
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
