using MyApi.Data;
using MyApi.Models;
using MyApi.DTOs;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;


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
            var user = _context.Users.Include(u => u.Advertisements).FirstOrDefault(u => u.UserId == advertisement.UserId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            user.Advertisements.Add(advertisement);
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

        public bool AddParticipant(int advertisementId, int participantId)
        {
            var advertisement = _context.Advertisements.FirstOrDefault(a => a.AdvertisementId == advertisementId);

            if (advertisement == null)
                throw new KeyNotFoundException("Advertisement not found");

            if (advertisement.ApplicantUserIds.Contains(participantId))
                throw new InvalidOperationException("Participant already added to the advertisement");

            // Add the participant's ID to the list
            advertisement.ApplicantUserIds.Add(participantId);

            // Save the changes to the database
            _context.SaveChanges();

            return true;
        }



        public IEnumerable<AdvertisementDto> GetFilteredAdvertisementsForUser(int userId)
        {
            var user = _context.Users
                .Include(u => u.Education)
                .Include(u => u.Jobs)
                .FirstOrDefault(u => u.UserId == userId);

            if (user == null) return Enumerable.Empty<AdvertisementDto>();

            var userDegree = user.Education.Max(e => e.Degree);
            var userEducationLevel = user.Education.Max(e => e.Level);
            var userJobIndustry = user.Jobs.Max(j => j.Industry);
            var userJobLevel = user.Jobs.Max(j => j.Level);
            var userJobPosition = user.Jobs.Max(j => j.Position);

            return _context.Advertisements
                .Where(ad =>
                    ad.RequiredDegree == userDegree &&
                    (ad.RequiredEducationLevel == userEducationLevel ||
                    ad.RequiredEducationLevel == userEducationLevel + 1 ||
                    ad.RequiredEducationLevel == userEducationLevel - 1) &&
                    ad.RequiredPosition == userJobPosition
                )
                .Select(ad => new AdvertisementDto
                {
                    AdvertisementId = ad.AdvertisementId,
                    Title = ad.Title,
                    Description = ad.Description,
                    PostedDate = ad.PostedDate,
                    RequiredDegree = ad.RequiredDegree,
                    RequiredEducationLevel = ad.RequiredEducationLevel,
                    RequiredPosition = ad.RequiredPosition,
                    RequiredIndustry = ad.RequiredIndustry,
                    RequiredJobLevel = ad.RequiredJobLevel,
                    MinimumYearsExperience = ad.MinimumYearsExperience,
                    RequiredSkill = ad.RequiredSkill,
                    UserId = ad.UserId // Επιστροφή του UserId
                })
                .ToList();
        }

    }
}
