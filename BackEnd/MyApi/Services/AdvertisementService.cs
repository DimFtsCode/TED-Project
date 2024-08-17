using MyApi.Data;
using MyApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace MyApi.Services
{
    public class AdvertisementService
    {
        private readonly AppDbContext _context;

        public AdvertisementService(AppDbContext context)
        {
            _context = context;
        }

        // Δημιουργία αγγελίας
        public Advertisement CreateAdvertisement(Advertisement advertisement)
        {
            _context.Advertisements.Add(advertisement);
            _context.SaveChanges();
            return advertisement;
        }

        // Ενημέρωση αγγελίας
        public Advertisement UpdateAdvertisement(int id, Advertisement updatedAdvertisement)
        {
            var advertisement = _context.Advertisements.FirstOrDefault(a => a.AdvertisementId == id);
            if (advertisement == null) throw new KeyNotFoundException("Advertisement not found");

            advertisement.Title = updatedAdvertisement.Title;
            advertisement.Description = updatedAdvertisement.Description;
            advertisement.RequiredDegree = updatedAdvertisement.RequiredDegree;
            advertisement.RequiredEducationLevel = updatedAdvertisement.RequiredEducationLevel;
            advertisement.RequiredPosition = updatedAdvertisement.RequiredPosition;
            advertisement.RequiredIndustry = updatedAdvertisement.RequiredIndustry;
            advertisement.RequiredJobLevel = updatedAdvertisement.RequiredJobLevel;
            advertisement.MinimumYearsExperience = updatedAdvertisement.MinimumYearsExperience;
            advertisement.RequiredSkill = updatedAdvertisement.RequiredSkill;

            _context.SaveChanges();
            return advertisement;
        }

        // Διαγραφή αγγελίας
        public bool DeleteAdvertisement(int id, int userId)
        {
            var advertisement = _context.Advertisements.FirstOrDefault(a => a.AdvertisementId == id && a.UserId == userId);
            if (advertisement == null) return false;

            _context.Advertisements.Remove(advertisement);
            _context.SaveChanges();
            return true;
        }

        // Εύρεση αγγελίας με βάση το ID
        public Advertisement GetAdvertisementById(int id)
        {
            var advertisement = _context.Advertisements.FirstOrDefault(a => a.AdvertisementId == id);
            if (advertisement == null) throw new KeyNotFoundException("Advertisement not found");
            return advertisement;
        }

        // Λήψη όλων των αγγελιών
        public List<Advertisement> GetAllAdvertisements()
        {
            return _context.Advertisements.ToList();
        }

        public IEnumerable<Advertisement> GetAdvertisementsByUser(int userId)
        {
            return _context.Advertisements.Where(ad => ad.UserId == userId).ToList();
        }

        public IEnumerable<User> GetParticipantsByAdvertisementId(int advertisementId)
        {
            var advertisement = _context.Advertisements.FirstOrDefault(a => a.AdvertisementId == advertisementId);

            if (advertisement == null) throw new KeyNotFoundException("Advertisement not found");

            // Επιστροφή της λίστας των συμμετεχόντων
            var participants = _context.Users.Where(u => advertisement.ApplicantUserIds.Contains(u.UserId)).ToList();
            return participants;
        }

        public bool RemoveParticipant(int advertisementId, int participantId)
        {
            var advertisement = _context.Advertisements.FirstOrDefault(a => a.AdvertisementId == advertisementId);

            if (advertisement == null) 
                throw new KeyNotFoundException("Advertisement not found");

            if (!advertisement.ApplicantUserIds.Contains(participantId))
                throw new KeyNotFoundException("Participant not found in the advertisement");

            // Remove the participant's ID from the list
            advertisement.ApplicantUserIds.Remove(participantId);

            // Save the changes to the database
            _context.SaveChanges();

            return true;
        }
    }
}
