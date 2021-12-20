import {stripNonValidXml} from "../pages";

export interface FacultyMember {
    name: string;
    school: IUSchool;
    title: string;
    profilePictureUrl?: string | null;
    linkToProfile: string;
    email?: string | null;
    phoneNumber?: string | null;
    office?: string | null;
}

export enum IUSchool {
    COAS = "College of Arts and Sciences",
    JACOBS = "Jacobs School of Music",
    LUGAR = "Hamilton-Lugar School of Global and International Studies",
    MEDIA = "Media School",
    ONEILL = "O’Neill School of Public and Environmental Affairs",
    KELLEY = "Kelley School of Business",
    MAURER = "Maurer School of Law"
}


export function convertFacultyToXml(facultyMembers: FacultyMember[]): string {
    return facultyMembers
        .sort((a, b) => getLastName(a.name).localeCompare(getLastName(b.name)))
        .map(faculty => stripNonValidXml(`<article class="profile item" data-filters="${IUSchool[faculty.school]};" itemscope="itemscope"
            itemtype="http://schema.org/Person">
            <figure class="media profile-thumb" itemscope="itemscope" itemtype="http://schema.org/ImageObject"><a
                    href="${faculty.linkToProfile}"><img alt="${faculty.name}" itemprop="image"
                        src="${faculty.profilePictureUrl ?? "https://french.indiana.edu/_assets/no-photo-headshot.jpg"}"></a></figure>
            <div class="content">
                <h1><a href="${faculty.linkToProfile}">${faculty.name}</a></h1>
                <p class="title small">${faculty.title}</p>
                <ul class="profile-contact">
                    ${(faculty.email != null) ? `<li class="icon-email" itemprop="email"><a rel="nofollow" href="mailto:${faculty.email}" class="email">${faculty.email}</a></li>` : ``}
                   ${(faculty.phoneNumber != null) ? `<li class="icon-phone" itemprop="telephone"><a href="tel:${faculty.phoneNumber.trim().split("").filter(char => "0123456789".includes(char)).join("")}" class="external">${faculty.phoneNumber}</a></li>` : ``}
                   ${(faculty.office != null) ? `<li class="icon-map-marker">${faculty.office}</li>` : ``}
                </ul>
            </div>
        </article>`)).join("\n")
}

function getLastName(fullName: string): string {
    const split = fullName.split(" ")
    return split[split.length - 1]
}