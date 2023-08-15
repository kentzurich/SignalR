using System.ComponentModel.DataAnnotations;

namespace SignalRDemo.Models
{
    public class ChatRoom
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
